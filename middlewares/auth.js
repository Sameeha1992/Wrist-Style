
const User = require("../models/userSchema");



const userAuth= (req,res,next)=>{
    if(req.session.user){
        User.findById(req.session.user)
        .then(data=>{
            if(data && !data.isBlocked){
                next();
            }else{
                res.redirect("/login")
            }
        })
        .catch(error=>{
            console.log("Error in user auth middleware");
            res.status(500).send("Internal Server error")
        })
    }else{
        res.redirect("/login")
    }
}


//Admin authentication:


const adminAuth= (req,res,next)=>{
    User.findOne({isAdmin:true})
    .then(data=>{
        if(data){
            next();
        }else{
            res.redirect("/admin/login")
        }
    })
   .catch(error=>{
    console.log("Error in adminauth middleware",error);
    res.status(500).send("Internal Server Error")
   })
}



// const adminAuth = (req, res, next) => {
//     // Check if the session exists
//     if (req.session.admin) {
//         // Find the user based on the session ID
//         User.findById(req.session.admin)
//             .then(user => {
//                 if (user) {
//                     // Check if the user is an admin
//                     if (user.isAdmin) {
//                         next();  // Proceed to the next middleware or route handler
//                     } else {
//                         // If the user is not an admin, destroy the session and redirect
//                         req.session.destroy(err => {
//                             if (err) {
//                                 console.log("Error destroying session:", err);
//                                 return res.status(500).send("Internal Server Error");
//                             }
//                             res.redirect("/admin/login");  // Redirect to login page
//                         });
//                     }
//                 } else {
//                     // If user not found, destroy the session and redirect
//                     req.session.destroy(err => {
//                         if (err) {
//                             console.log("Error destroying session:", err);
//                             return res.status(500).send("Internal Server Error");
//                         }
//                         res.redirect("/admin/login");  // Redirect to login page
//                     });
//                 }
//             })
//             .catch(error => {
//                 console.log("Error in adminAuth middleware:", error);
//                 res.status(500).send("Internal Server Error");
//             });
//     } else {
//         // Redirect to login if no session exists
//         res.redirect("/admin/login");
//     }
// };




module.exports={
    userAuth,
    adminAuth

    
}