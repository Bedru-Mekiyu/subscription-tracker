import { Router } from "express";
import authorize from '../middlewares/auth.middleware.js'
import { createSubscription, getUserSubscriptions, validateCreateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => res.send({ title: 'Get all subscriptions' }))
subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'Get subscription details' }))
subscriptionRouter.post('/', authorize, validateCreateSubscription, createSubscription)
subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'update subscriptions' }))
subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'update subscriptions' }))
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions)
subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'cancel all user subscriptions' }))
subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'Get upcoming renewals' }))

export default subscriptionRouter;