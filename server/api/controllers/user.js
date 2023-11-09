import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"
import User from "../../models/userModel.js"

const userController = async (req, res) => {
    const users = await User.find()
    res.json({
        user: users
    })
}

export const updateUser = async(req, res, next) => {
    try {
        if (req.user.id !== req.params.id) return next(errorHandler(403, "Forbidden"))
        if (req.body.password) {
            if (req.body.password.length < 8) return next(errorHandler(403, "Password length must be more than 7 characters"))
            req.user.password = bcryptjs.hashSync(req.body.password, 10)
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email, 
                password: req.user.password,
                avatar: req.body.avatar
            }
        },
        { new: true } //This ensures the new information is sent back as response
        )
        const { password, ...otherUserInfo } = updatedUser._doc
        res.status(200).json(otherUserInfo)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(errorHandler(401, "Unauthorized"))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json({
            message: "User deleted"
        })
    } catch (error) {
        next(error)
    }
}

export default userController