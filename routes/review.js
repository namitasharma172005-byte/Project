const express=require("express");
const router=express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const reviewController=require("../Controlller/review.js")

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }
    next();
};
// CREATE REVIEW
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createreview));

// DELETE REVIEW
router.delete("/:reviewId",wrapAsync(reviewController.deletereview));
module.exports=router;