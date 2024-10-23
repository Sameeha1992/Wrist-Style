const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose")
const dotenv=require("dotenv").config();
const session=require("express-session")
const userRouter=require("./routes/userRouter")


const connectDB = async(req,res)=>{
    try {
       console.log("Attempt to connect Mongodb")
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Database Working")
    } catch (error) {
        console.error("MongoDb connection error",error)
        
        
    }
}


connectDB()
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        httpOnly:true,
        maxAge:72*60*60*1000
    }
}))


app.use((req,res,next)=>{
    res.set("cache-control","no-store")
    next();
})
app.set("view engine","ejs");
app.set("views", [
    path.join(__dirname, "/views/user"),
    path.join(__dirname, "/views/admin")
]);

app.use(express.static(path.join(__dirname, "public")));



app.use("/",userRouter)




app.listen(process.env.PORT||3000,()=>{
console.log("Server Running");

})



module.exports=app;