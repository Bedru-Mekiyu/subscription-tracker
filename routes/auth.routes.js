import { Router } from "express";
import { signIn, signOut, signUp, validateSignIn, validateSignUp } from "../controllers/auth.controller.js";
const authRouter = Router();
authRouter.post('/sign-up', validateSignUp, signUp);
authRouter.post('/sign-in', validateSignIn, signIn)
authRouter.post('/sign-out', signOut);

export default authRouter;