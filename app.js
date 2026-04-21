if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}



const express = require("express");
const app = express();
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const ExpressError = require("./utils/ExpressError.js");

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes=require("./routes/user.js");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User = require("./models/user.js");

const Mongo_Url="mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(Mongo_Url);
}

main()
    .then(() => console.log("connected to DB"))
    .catch(err => console.log(err));

// ---------------- APP CONFIG ----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ---------------- MIDDLEWARE ----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ---------------- SESSION CONFIG ----------------
const sessionOptions = {
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ---------------- FLASH MIDDLEWARE ----------------
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;   
    next();
});

app.get("/demouser",async(req,res)=>{
let fakeUser=new User({
email:"Student@gmail.com",
username:"anaya",
});
let registereduser=await User.register(fakeUser,"hello");
res.send(registereduser);
})

// ---------------- DEBUG ----------------
app.use((req, res, next) => {
    console.log("BODY:", req.body);
    next();
});

// ---------------- ROUTES ----------------
/*app.get("/", (req, res) => {
    res.send("Hi I am root");
});*/

app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

// ---------------- 404 ----------------
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { message });
});

// ---------------- SERVER ----------------
app.listen(8080, () => {
    console.log("server is listening on port 8080");
});
