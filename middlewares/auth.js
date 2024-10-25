
const session=require("express-session")

const isLogin=async(req,res,next)=>{
    try {
        console.log("Checking session in isLogin:", req.session.user);

        if(req.session.user) {
            res.redirect("/home")
        } else {
            next();
        }
    } catch (error) {
        console.log(error)
    }
}


const isLogout=async(req,res,next)=>{console.log("Checking session in isLogout:", req.session.user);

    try {
        if (!req.session.user) {
            next()
        } else {
            res.redirect('/home')
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports={
    isLogin,
    isLogout
}