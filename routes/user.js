const express = require("express");
const router = express.Router();
const User=require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
  
router.get("/signup",(req,res)=>{
res.render("user/signup.ejs");
});
 router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
const newUser=new User({email,username});
const registeredUser=await User.register(newUser,password);
console.log(registeredUser);
req.login(registeredUser,(err)=>{
if(err){
return next(err);
}
req.flash("success","Welcome To Wanderlust");
res.redirect("/listings");
});

    }
    catch(err){
    req.flash("error",err.message);
    res.redirect("/signup");
    }
 })
);
router.get("/login",(req,res)=>{
res.render("user/login.ejs");
});


router.post("/login",
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:true,
    }),
    async(req,res)=>{
        req.flash("success","Welcome to Wanderlust !!!! You're logged in!");
        res.redirect("/listings");
    }
);
router.get("/logout",(req,res,next)=>{
req.logout((err)=>{
if(err){
return next(err);
}
req.flash("success","You're logged out");
res.redirect("/listings");
});
});
module.exports=router;