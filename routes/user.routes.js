import { Router } from "express";
import { getUser,getUsers } from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const userRouter=Router()

userRouter.get('/',getUsers);

userRouter.post('/',(req,res)=>res.send({title:"create new users"}));

userRouter.get('/:id',authorize,getUser);

userRouter.patch('/:id',(req,res)=>res.send({title:"update  user"}));

userRouter.delete('/:id',(req,res)=>res.send({title:"delet  user"}));
export default userRouter;