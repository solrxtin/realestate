import userSchema from "./schema/userSchema.js";
import mongoose from "mongoose"

const User = mongoose.model('User', userSchema)

export default User