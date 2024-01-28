const TasksModel = require('../models/TasksModel');


// Create
exports.create=(req,res)=>{
    let reqBody = req.body
    reqBody.email = req.headers['email'];
    TasksModel.create(reqBody)
        .then(data => res.json(data))
        .catch(err => res.json(err))
}


// Delete
exports.delete=(req,res)=>{
    let id = req.params.id;
    let Query = {_id:id};
    TasksModel.deleteOne(Query)
        .then(data => res.json(data))
        .catch(err => res.json(err))
}


// Update
exports.update=(req,res)=>{
    const id = req.params.id
    const status = req.params.status;
    const Query = {_id:id};
    const reqBody = {status:status}
    TasksModel.updateOne(Query,reqBody)
    .then(data => res.status(200).json({status:"success",data:data}))
    .catch(err => res.status(400).json({status:"failed",data:err}))
}


// List By Status
exports.list = (req,res)=>{
    let status= req.params.status;
    let email=req.headers['email'];
    TasksModel.aggregate([
        {$match:{status:status,email:email}},
        {$project:{
                _id:1,title:1,description:1, status:1,
                createdDate:{
                    $dateToString:{
                        date:"$createdDate",
                        format:"%d-%m-%Y"
                    }
                }
            }}
    ])
        .then(data => res.status(200).json({status:"success",data:data}))
        .catch(err => res.status(200).json({status:"failed",data:err}))
}


// Task Count
exports.count = (req,res)=>{
    let email=req.headers['email'];
    TasksModel.aggregate([
        {$match:{email:email}},
        {$group:{_id:'$status',sum:{$count: {}}}}
    ])
        .then(data => res.status(200).json({status:"success",data:data}))
        .catch(err => res.status(400).json({status:"failed",data:err}))
}