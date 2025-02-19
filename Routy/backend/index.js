// const express = require("express");
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
dotenv.config();

// console.log(process.env.MONGO_URI);

const app = express();
const port = 5000;

app.get("/",(req,res) => {
    res.send(`Server is ready on port ${port}`);
});

app.listen(5000,()=>{
    connectDB();
    console.log(`Server Started at http://localhost:${port}`);
});