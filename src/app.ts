import express, { Request, Response }  from "express";
import mongoose from 'mongoose';
import CryptoRouter from "./routes/crypto";
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();
const app=express()
const port=3000

app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200,
  }
  ));

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI||'mongodb://localhost:27017/fomoFactory')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/crypto',CryptoRouter)


app.get('/',(req: Request,res: Response)=>{
    res.json({
        message:"hello"
    })
})

app.listen(port,()=>{
    console.log(`Listenning on port ${port}`)
})