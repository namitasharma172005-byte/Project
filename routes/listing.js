const express = require("express");
const router = express.Router();

const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listingcontroller = require("../Controlller/listing.js");

const multer = require("multer");
const{storage}=require("../cloudconfig.js");
const upload = multer({ storage });

// ---------------- MIDDLEWARE ----------------

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in");
        return res.redirect("/login");
    }
    next();
};

const validateListing = (req, res, next) => {
    const { listing } = req.body;

    if (!listing) {
        throw new ExpressError(400, "Listing data is required");
    }

    const { error } = listingSchema.validate({ listing });

    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, msg);
    }

    next();
};

// ---------------- ROUTES ----------------

router.get("/", wrapAsync(Listingcontroller.index));

router.get("/new", isLoggedIn, Listingcontroller.RenderNewform);

router.get("/:id", wrapAsync(Listingcontroller.Show));

router.post(
  "/",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(Listingcontroller.CreateListing)
);

router.get("/:id/edit", isLoggedIn, wrapAsync(Listingcontroller.EditListing));

router.put(
  "/:id",
  isLoggedIn,
  upload.single("image"),
  validateListing,
  wrapAsync(Listingcontroller.updateListing)
);

router.delete("/:id", isLoggedIn, wrapAsync(Listingcontroller.DeleteListing));

module.exports = router;