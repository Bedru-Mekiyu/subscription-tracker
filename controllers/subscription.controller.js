import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';
import { body, validationResult } from 'express-validator';
import dayjs from 'dayjs';

// Validation middleware for createSubscription
export const validateCreateSubscription = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('price').isFloat({ min: 0, max: 1000 }).withMessage('Price must be between 0 and 1000'),
  body('currency').isIn(['USD', 'EUR', 'GBP']).withMessage('Invalid currency'),
  body('frequency').isIn(['daily', 'weekly', 'monthly', 'yearly']).withMessage('Invalid frequency'),
  body('category').isIn(['sports', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'politics', 'other']).withMessage('Invalid category'),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method required'),
  body('startDate').isDate().withMessage('Invalid start date'),
  body('renewalDate').optional().isDate().withMessage('Invalid renewal date'),
];

export const createSubscription = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: { subscriptionId: subscription.id },
      headers: { 'content-type': 'application/json' },
      retries: 3,
    });

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (error) {
    next(error);
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not authorized to access this resource");
      error.statusCode = 403;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
}

// controllers/subscription.controller.js

// ... existing imports and functions (createSubscription, getUserSubscriptions)

// Get single subscription
export const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate('user', 'name email');
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }
    // Check if user owns it
    if (subscription.user._id.toString() !== req.user._id.toString()) {
      const error = new Error("You are not authorized to view this subscription");
      error.statusCode = 403;
      throw error;
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// Update subscription
export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }
    // Check ownership
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("You are not authorized to update this subscription");
      error.statusCode = 403;
      throw error;
    }
    // Update fields (e.g., name, price, etc.)
    Object.assign(subscription, req.body);
    await subscription.save();
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// Delete subscription
export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }
    // Check ownership
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("You are not authorized to delete this subscription");
      error.statusCode = 403;
      throw error;
    }
    await subscription.deleteOne();
    res.status(200).json({ success: true, message: "Subscription deleted" });
  } catch (error) {
    next(error);
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }
    // Check ownership
    if (subscription.user.toString() !== req.user._id.toString()) {
      const error = new Error("You are not authorized to cancel this subscription");
      error.statusCode = 403;
      throw error;
    }
    subscription.status = 'cancelled';
    await subscription.save();
    // Optional: Cancel workflow if needed (Upstash cancel API)
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// Get upcoming renewals (e.g., next 30 days for the user)
export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const today = dayjs();
    const thirtyDaysFromNow = today.add(30, 'day').toDate();

    const renewals = await Subscription.find({
      user: req.user._id,
      renewalDate: { $gte: today.toDate(), $lte: thirtyDaysFromNow },
      status: 'active'
    }).sort('renewalDate');

    res.status(200).json({ success: true, data: renewals });
  } catch (error) {
    next(error);
  }
};

// Get all subscriptions (admin only – add role check if needed)
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate('user', 'name email');
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};