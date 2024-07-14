import express, { Request, Response }  from "express";
import mongoose from 'mongoose';
import CryptoRouter from "./routes/crypto";

const app=express()
const port=3000

const MONGODB_URI = 'mongodb://localhost:27017/fomoFactory';

mongoose.connect(MONGODB_URI)
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