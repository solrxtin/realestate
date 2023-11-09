
import Listing from "../../models/listingModel.js"

export const createListing = async(req, res, next) => {
    try {
        const listing = await Listing.create(req.body)
        return res.status(201).json({
            success: true,
            message: listing
        })
    } catch (error) { 
        next(error)
    }
}