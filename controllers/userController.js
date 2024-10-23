const User=require("../models/userSchema")
const env= require("dotenv").config();
const nodemailer = require("nodemailer")
const bcrypt=require("bcrypt");
const user_route=require("../routes/userRouter")







//Load Homepage
const loadHomepage = async (req, res) => {
    try {
        // Render the "home" template
        return res.render("home");
    } catch (error) {
        console.log("Homepage not rendered:", error); // Log the error for debugging
        res.status(500).send("Server error"); // Send a 500 status if there's an error
    }
};




const pageNotFound= async(req,res)=>{
     try{
          res.render("pageNotFound")

     }
     catch(error){
        console.log("Error rendering page-404",error)
        res.status(500).send("Server error")
     }
}



const loadSignup=async(req,res)=>{
     try{
          res.render("signup")
     }
     catch(error){
          console.log("Error page rendered",error);
          res.status(500).send("Server not found")
     }
}

//Generate otp function

function generateOtp(){
     return Math.floor(100000 + Math.random()*900000).toString();

}

//Send Verification Email function

async function sendVerificationEmail(email,otp){
     try {
    const transporter= nodemailer.createTransport({
     service:"gmail",
     port:587,
     secure:false,
     requireTLS:true,
     auth:{
          user: process.env.NODEMAILER_EMAIL,
          pass: process.env.NODEMAILER_PASSWORD
     }
    });
    const info = await transporter.sendMail({
     from:process.env.NODEMAILER_EMAIL,
     to:email,
     subject:"Verify your account",
     text:`Your OTP is ${otp}`,
     html:`<b>Your OTP: ${otp}</b>`,
    });

    return info.accepted.length >0
          
     } catch (error) {
          console.error("Error sending email",error);
          return false;
          
     }
}




//Sign Up functionalities

const signup=async(req,res)=>{
     try{
          const{name,phone,email,password,cpassword}=req.body;
          if(password !==cpassword){
               return res.render("signup",{message:"Password do not match"})
          }

          const findUser = await User.findOne({email});
          if(findUser){
               return res.render("signup",{message:"User with this email already exists"})
          }

          const otp=generateOtp();

     const emailSent = await sendVerificationEmail(email,otp)     
     if(!emailSent){
          return res.status(400).json({error: "Failed to send verification"})
     }
     req.session.userOtp = otp;
     req.session.userData = {name,phone,email,password};
    
     console.log("OTP Sent",otp);
     res.redirect("verify-otp");

     }  catch (error){
          console.error("signup error",error);
          res.redirect("/pageNotFound")

     }
}

const getotp=async(req,res)=>{
     try{
          return res.status(200).render("verify-otp")
     }
     catch(error){
          console.error("Error",error)
          res.status(500).json({message:"Internal server error"})
     }
}


//Secure password Function

const securePassword= async (password)=>{
     try {
          const passwordHash = await bcrypt.hash(password,10)
          return passwordHash;
          
     } catch (error) {
          console.error("Error hashing password",error)
          
     }
};


  //Verify OTP function

     const verifyOtp=async(req,res)=>{
          try {
               const {otp} = req.body;
               console.log("Recieved otp",otp)

               if(otp===req.session.userOtp){
                    const user = req.session.userData
                    const passwordHash = await securePassword(user.password);
                    const saveUserData = new User({
                         name:user.name,
                         email:user.email,
                         phone:user.phone,
                         password:passwordHash,
                    })
                    await saveUserData.save();
                    req.session.user = saveUserData._id;
                    res.json({success:true})
               } else{
                   res.status(400).json({success:false,message:"Invalid OTP,Please try again"}) 
               }    
          } catch (error) {
               console.error("Error Verifying OTP",error);
               res.status(500).json({success:false,message:"An error occured"})
          }
     }

const resendOtp=async(req,res)=>{
   try {
     const {email} = req.session.userData;
     if(!email){
          return res.status(400).json({success:false,message:"Email not found in session"})
     }
     const otp= generateOtp();
     req.session.userOtp=otp;

     const emailSent = await sendVerificationEmail(email,otp);
     if(emailSent){
          console.log(`Resent otp ${otp}`);
          res.status(200).json({success:true,message:"OTP Resend Successfully"})  
     } else{
          res.status(500).json({success:false,message:"Failed to Resend OTP Please try again"})
     }
     
   } catch (error) {
     console.error("Error in resending OTP",error);
     res.status(500).json({success:false,message:"Internal Server Error.Please try again"})
   }
   
}



// const Login=async(req,res)=>{
//      try{
//           res.render("login")
//      }
//      catch(error){
//           console.log("Login page not rendered");
//           res.status(500).send("Server error")

//      }
// }





module.exports={
     loadHomepage,
     
     // Login,
     loadSignup,
     signup, 
     getotp,
     verifyOtp,
     resendOtp

     

}