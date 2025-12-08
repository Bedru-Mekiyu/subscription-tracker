import express from 'express';
import userRouter from './routes/user.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import authRouter from './routes/auth.routes.js';
import {  PORT} from './config/env.js'

const app=express();
 
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/subscription',subscriptionRouter);

app.get('/',(req,res)=>{
    res.send('wellcome to the subscription tracker api');
});


app.listen(PORT,()=>{
    console.log(`server running on https://localhost:${PORT}`)
})
export default app;