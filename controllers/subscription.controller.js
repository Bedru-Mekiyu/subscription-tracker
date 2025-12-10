import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js';
import { SERVER_URL } from '../config/env.js';
import { body, validationResult } from 'express-validator';

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