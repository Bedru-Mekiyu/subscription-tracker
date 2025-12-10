// routes/subscription.routes.js

import { Router } from "express";
import authorize from '../middlewares/auth.middleware.js';
import {
  createSubscription,
  getUserSubscriptions,
  getSubscription,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals,
  getAllSubscriptions,
  validateCreateSubscription
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

// Specific routes FIRST
subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

// Admin or public
subscriptionRouter.get('/', authorize, getAllSubscriptions);

// Parameterized routes LAST
subscriptionRouter.get('/:id', authorize, getSubscription);
subscriptionRouter.put('/:id', authorize, updateSubscription);
subscriptionRouter.delete('/:id', authorize, deleteSubscription);
subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

// Create
subscriptionRouter.post('/', authorize, validateCreateSubscription, createSubscription);

export default subscriptionRouter;