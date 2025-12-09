import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // 1. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        // 2. Hash password correctly
        const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(String(password), salt);

        // 3. Create user inside a transaction
        const newUser = await User.create(
            [{ name, email, password: hashedPassword }],
            { session }
        );

        // 4. Create token
        const token = jwt.sign(
            { userId: newUser[0]._id },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // 5. Complete transaction
        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser[0],
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};



export const signIn= async(req,res,next)=>{

    try {
        const {password,email}=req.body;
        const user = await User.findOne({email});
        if(!user){
            const error= new Error('User not found')
            error.statusCode=404;
            throw error;

        }
        const isPasswordValid= await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            const error= new Error("invalid password");
             error.statusCode=401;
             throw error;
            
        }
    const token= jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
    res.status(200).json({
        success:true,
        message:'User signed in successfully',
        data:{
            token,
            user,
        }
    });
    } catch (error) {
        next(error)
    }

}
export const signOut=(req,res,next)=>{

}