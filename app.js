import express from 'express'
const app=express();
import {  PORT} from './config/env.js'
app.get('/',(req,res)=>{
    res.send('wellcome to the subscription tracker api');
});


app.listen(PORT,()=>{
    console.log(`server running on https://localhost:${PORT}`)
})
export default app;