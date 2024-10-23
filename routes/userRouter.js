const express=require("express");
const user_router=express.Router();
const userController=require("../controllers/userController")


user_router.get("/",userController.loadHomepage);

user_router.get("/signup",userController.loadSignup);
user_router.post("/signup",userController.signup)


user_router.get("/verify-otp",userController.getotp);
user_router.post("/verify-otp",userController.verifyOtp)
user_router.post("/resend-otp",userController.resendOtp)





module.exports=user_router