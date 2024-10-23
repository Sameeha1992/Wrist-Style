const session=require("express-session");

const isLogin=async(req,res,next)=>{
    try{
        if(!req.session.userId){
            return res.redirect("/")
        }
           
        
        next();
    }catch(error){
        console.log(error.message)
    }

}


const isLogout=async(req,res,next)=>{
    try{
        if(req.session.userId){
            return res.redirect("/home")
        }
        next();
    }catch(error){
        console.log(error.message)
    }
}

module.exports={
    isLogin,
    isLogout
}