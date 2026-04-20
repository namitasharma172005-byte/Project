const Listing=require("../models/listing.js")
const Review=require("../models/review.js");


module.exports.createreview=async (req, res) => {
        console.log(req.params.id);

        let listing = await Listing.findById(req.params.id);

        let newReview = new Review(req.body.review);
         newReview.author = req.user._id;
        await newReview.save();

        listing.reviews.push(newReview._id);
        await listing.save();

        res.redirect(`/listings/${listing._id}`);
    };
    /*module.exports.deletereview=async (req, res) => {
    
            let { id, reviewId } = req.params;
    
            let review = await Review.findById(reviewId);
    
        if (!review.author.equals(req.user._id)) {
          req.flash("error", "You are not the owner of this review!");
          return res.redirect(`/listings/${id}`);
        }
    
            await Listing.findByIdAndUpdate(id, {
                $pull: { reviews: reviewId }
            });
    
            await Review.findByIdAndDelete(reviewId);
    
            res.redirect(`/listings/${id}`);
        };
        */
       module.exports.deletereview = async (req, res) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);

    
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }


    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the owner of this review!");
        return res.redirect(`/listings/${id}`);
    }

    
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    
    await Review.findByIdAndDelete(reviewId);


    req.flash("success", "Review deleted successfully!");

    res.redirect(`/listings/${id}`);
};