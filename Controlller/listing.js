const Listing=require("../models/listing.js")

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.RenderNewform=(req, res) => {
        res.render("listings/new.ejs");
    };
 
    module.exports.Show= async (req, res) => {
        const { id } = req.params;
    
        const listing = await Listing.findById(id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
            })
            .populate("owner"); // to show owner info
    
        // If listing not found
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }
    
        // Render show page
        res.render("listings/show.ejs", { listing });
    };

    module.exports.CreateListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    if (req.file) {
        newListing.image = {
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename
        };
    }

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect(`/listings/${newListing._id}`);
};
        module.exports.EditListing=async (req, res) => {
        
                const { id } = req.params;
                const listing = await Listing.findById(id);
        
                // If listing not found
                if (!listing) {
                    req.flash("error", "Listing not found!");
                    return res.redirect("/listings");
                }
        
                res.render("listings/edit.ejs", { listing });
            };

            module.exports.updateListing=async (req, res) => {
            
                    const { listing } = req.body;
                    if (req.file) {
        newListing.image = {
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename
        };
    }

            
                    const updateData = {
                        ...listing,
                        ...(listing.image && listing.image.trim() !== "" && {
                            image: {
                                url: listing.image.trim(),
                                filename: "listingimage"
                            }
                        })
                    };
            
                    await Listing.findByIdAndUpdate(req.params.id, updateData);
            
                    req.flash("success", "Listing Updated Successfully!");
                    res.redirect(`/listings/${req.params.id}`);
                };
                module.exports.DeleteListing=async (req, res) => {
                
                        await Listing.findByIdAndDelete(req.params.id);
                
                        req.flash("success", "Listing Deleted Successfully!");
                        res.redirect("/listings");
                    };
    
    
    
    
    
    
