import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error('please define the MONOGODB_URI EVVIROMENT VARIABLE INSIDER .env<development/production>.local')
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`connected to database in ${NODE_ENV} MODE `)
  } catch (error) {
    console.error("Error connecting to database : ", error);
    process.exit(1)
  }
}
export default connectToDatabase;