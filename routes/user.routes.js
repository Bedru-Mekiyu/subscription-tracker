import { Router } from "express";

const userRouter=Router()

userRouter.get('/',(req,res)=>res.send({title:"get all users"}));

userRouter.post('/',(req,res)=>res.send({title:"create new users"}));

userRouter.get('/:id',(req,res)=>res.send({title:"get  user details"}));

userRouter.patch('/:id',(req,res)=>res.send({title:"update  user"}));

userRouter.delete('/:id',(req,res)=>res.send({title:"delet  user"}));
export default userRouter;