const express = require('express');
const UsersController = require("../controllers/UsersController");
const TasksController = require("../controllers/TasksController")
const AuthVerifyMiddleware = require('../middleware/AuthVerifyMiddleware')

const router = express.Router();


router.post("/registration",UsersController.registration)
router.post("/login",UsersController.login)
router.post("/update",AuthVerifyMiddleware,UsersController.update)


router.post('/create',AuthVerifyMiddleware,TasksController.create)
router.get('/delete/:id',AuthVerifyMiddleware,TasksController.delete)
router.get('/update/:id/:status',AuthVerifyMiddleware,TasksController.update)
router.get('/list/:status',AuthVerifyMiddleware,TasksController.list)
router.get('/count',AuthVerifyMiddleware,TasksController.count)


router.get("/RecoverVerifyEmail/:email",UsersController.RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp",UsersController.RecoverVerifyOTP);
router.post("/RecoverResetPass",UsersController.RecoverResetPass);
router.get("/details",AuthVerifyMiddleware,UsersController.details);

module.exports = router;