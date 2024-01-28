const UsersModel = require("../models/UsersModel");
const jwt = require('jsonwebtoken');
const OTPModel = require("../models/OTPModel");
const SendEmailUtility = require("../utility/SendEmailUtility");

// Registration
exports.registration=(req,res)=>{
    const reqBody = req.body;
    UsersModel.create(reqBody)
        .then(data => res.status(200).json({status:"success",data:data}))
        .catch(err => res.status(200).json({status:"Failed",data:err}))
}


// Login
exports.login = async (req,res)=>{
    const UserLoginService = async (Request,UsersModel) =>{
        try{
            let data = await UsersModel.aggregate([{$match:Request.body}, {$project:{_id:1,email:1,firstName:1,lastName:1,mobile:1,photo:1}}])
            if(data.length>0){
                let Payload = {exp: Math.floor(Date.now() / 1000) + (24*60*60), data:data[0]['email']}
                let token = jwt.sign(Payload,'SecretKey123456789');
                res.status(200).json({status:"success",token:token,data:data[0]})
            }
            else{
                return {status:"Unauthorized"}
            }
        }
        catch (e){
            return {status: "Failed", data:e.toString()}
        }
    }
    let Result = await UserLoginService(req,UsersModel)
    res.status(200).json(Result)
}

// Update
exports.update = async (req,res)=>{
    const UserUpdateService = async (Request,UsersModel) =>{
        try{
            let data = await UsersModel.updateOne({email: Request.headers['email']}, Request.body)
            return {status: 'success', data:data}
        }
        catch (e) {
            return {status: "Failed", data:e.toString()}
        }
    }
    let Result = await UserUpdateService(req,UsersModel)
    res.status(200).json(Result)
}


// Details
exports.details=(req,res)=>{
    let email= req.headers['email'];
    UsersModel.aggregate([
        {$match:{email:email}},
        {$project:{_id:1,email:1,firstName:1,lastName:1,mobile:1,photo:1,password:1}}
    ])
        .then(data => res.status(200).json({status:"success",data:data}))
        .catch(err => res.status(400).json({status:"failed",data:err}))
}


// Recover Email 
exports.RecoverVerifyEmail=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = Math.floor(100000 + Math.random() * 900000)
    try {
        // Email Account Query
        let UserCount = (await UsersModel.aggregate([{$match: {email: email}}, {$count: "total"}]))
        if(UserCount.length>0){
            // OTP Insert
            let CreateOTP = await OTPModel.create({email: email, otp: OTPCode})
            // Email Send
            let SendEmail = await SendEmailUtility(email,"Your PIN Code is= "+OTPCode,"Task Manager PIN Verification")
            res.status(200).json({status: "success", data: SendEmail})
        }
        else{
            res.status(200).json({status: "fail", data: "No User Found"})
        }
    }catch (e) {
        res.status(200).json({status: "fail", data:e})
    }
}



// OTP Verify
exports.RecoverVerifyOTP=async (req,res)=>{
    let email = req.params.email;
    let OTPCode = req.params.otp;
    let status=0;
    let statusUpdate=1;
    try {
        let OTPCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: status}}, {$count: "total"}])
        if (OTPCount.length>0) {
            let OTPUpdate = await OTPModel.updateOne({email: email, otp: OTPCode, status: status}, {
                email: email,
                otp: OTPCode,
                status: statusUpdate
            })
            res.status(200).json({status: "success", data: OTPUpdate})
        } else {
            res.status(200).json({status: "fail", data: "Invalid OTP Code"})
        }
    }
    catch (e) {
        res.status(200).json({status: "fail", data:e})
    }
}



// Verify Password
exports.RecoverResetPass=async (req,res)=>{

    let email = req.body['email'];
    let OTPCode = req.body['OTP'];
    let NewPass =  req.body['password'];
    let statusUpdate=1;

    try {
        let OTPUsedCount = await OTPModel.aggregate([{$match: {email: email, otp: OTPCode, status: statusUpdate}}, {$count: "total"}])
        if (OTPUsedCount.length>0) {
            let PassUpdate = await UsersModel.updateOne({email: email}, {
                password: NewPass
            })
            res.status(200).json({status: "success", data: PassUpdate})
        } else {
            res.status(200).json({status: "fail", data: "Invalid Request"})
        }
    }
    catch (e) {
        res.status(200).json({status: "fail", data:e})
    }
}
