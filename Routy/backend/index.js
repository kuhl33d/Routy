// const express = require("express");

import express from 'express';

const app = express();
const port = 5000;

app.get("/",(req,res) => {
    res.send(`Server is ready on port ${port}`);
});

app.listen(5000,()=>{
    console.log(`Server Started at http://localhost:${port}`);
});