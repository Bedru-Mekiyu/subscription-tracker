// routes/user.routes.js

import { Router } from "express";
import { getUser, getUsers, createUser, updateUser, deleteUser } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', getUsers);  // Get all users (admin?)

userRouter.post('/', authorize, createUser);  // Create new user

userRouter.get('/:id', authorize, getUser);  // Get single

userRouter.patch('/:id', authorize, updateUser);  // Update

userRouter.delete('/:id', authorize, deleteUser);  // Delete

export default userRouter;