// Basic Libraries
const express = require('express');
const router = require('./src/routes/api');
const app = new express();
const bodyParser = require('body-parser');



// Body Parser Implement
app.use(bodyParser.json())

// Security Middleware Lib Import
const rateLimit =require('express-rate-limit');
const helmet =require('helmet');
const mongoSanitize =require('express-mongo-sanitize');
const xss =require('xss-clean');
const hpp =require('hpp');
const cors =require('cors');

// Security Middleware Implement
app.use(cors())
app.use(helmet())
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


// Request Rate Limit
const limiter= rateLimit({windowMs:15*60*1000,max:3000})
app.use(limiter)



// Database Lib Import
const mongoose =require('mongoose');

// Mongo DB Database Connection
mongoose.connect("mongodb+srv://monir:1234@cluster0.qvhdxhq.mongodb.net/task?retryWrites=true&w=majority");


// Routing Implement
app.use("/api/v1",router)

// Undefined Route Implement
app.use("*",(req,res)=>{
    res.status(404).json({status:"fail",data:"Not Found"})
})

app.listen(5000,function () {
    console.log("App Run @5000")
})