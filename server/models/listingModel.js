import listingSchema from "./schema/listingShema.js";

import mongoose from "mongoose";


const Listing = mongoose.model('listing', listingSchema)

export default Listing