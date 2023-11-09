import User from '../../models/userModel.js'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'


export const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body
        if (password.length < 8 ) return next(errorHandler(403, 'Password length must be greater than 7'))
        const hashedPassword = bcryptjs.hashSync(password, 10)
        const newUser = new User({ username, email, password: hashedPassword, avatar: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAMAAADQmBKKAAAAOVBMVEX///+ZmZmVlZXl5eWRkZH8/PywsLDQ0NCioqLCwsLp6enIyMjy8vLs7Oynp6fe3t68vLy2trbW1tY3mPDOAAAEWUlEQVR4nO1by4KDIAwsCCjWZ///Y1ddt6siCQnYemBOuwfoMCQhhvB4ZGRkZGRkZGRkZGRkvKGbti+t6aoF3WjLvm3019j01lRSKSmlWDD9Mf0njO2/wKkuq/nHzyFVVdafZKNfRvjI/HES5jXppD+hVW2lgtn8Qkn7CZmaARNnK9PQTkOuVKl5eg3nnJKyzYV0dBmuzr9K5WUKtSbIdo5Qpr2Eji4lWZ5VJHWFSNow6SyUTHI+Bd16doxEkZZPH8PmF31KPmWUPKtI5b34pGRUsrzdhUrEKI0+M9JoVCTSZ2GUwNeKkN+ZkzQZFDdjGelHABsxvPqi6MtRoGJKERmz0fi8ZhgrWjQ3kSaOEWbQ0hyyiwZdQZRht9jsJ+G3x8ZEnP3YhlX1WTZYVzChiE3DIqInZa7hUfz42MAT+4NKgewaN6u14LzKckdKYCSEBt6wCjAFDZuR4kk0wMsELQEOF3Lg8GnBRQoJj0asiPMFCduBGOHRY3orgvmoFzwaCY+KHotevBj0BywWIetxoLWBZ6wQR2lSh2tkhaLDCHXIBFSzxo75DlmhRgiRD31Y8egtmyag8dFY7hdNiOhnPZqMIskxdr4KSfMzJCriOQT67USLjZjTT+jgGTAnE4Lk+KgFYCc2kinMwKxwByyXFpjk6JYTc2vcpqcJgdBWB3wzKkp9JqS8AFXFQqptpNQ6QHFo055xw08AZzPvKT1rDCuXkOqOuNP+zvlk6yPQwLED7vUro9Hx3WYILd9QTrNQQkKKwwnwCq/WXkJovrWzxXqJ2BRPSm39IkKzSpUZrB1MRatlX0ZoIRVWP/sAIengEkJhbi+VrEb73MGOnQy8UqO4fUDonyxn6Bv3TlXrph+qAKFIgRE/OlQH3YXrHr9aI33gY4erNOhXTNshiyIdrnD6EXYhp5FVkdIPMEFzKq8+wBVZUoIGFfPkGJwMayhrIKWwQJKvSMUmoOhF+7r3uhm1+OWfiFYi8lm1pESzBT5nI9m0/1OatPELfF9U1JLV+TTEZS3wiE0sNpznxbzq6alhk8sx5wUrVvtNoqlOHJ8n0LlE9FaHk6In92KpdafiXMA4y2I3cJzccknGFZUT0vh3gY6HsArn7tUC+yrQnYrlHUdbpEaODQ5Rjekdx6JTRA/QwYgUU+u9FcV0bjx3a+Ne4B2yIvL1xAaHGMJu3NsloSqiS2LXP8KWWu8DSEwjyY5QTG/DNrdOpVBMI8EupCUiFNlDtNk0FdFpW78JxTajPP7bdeSrLpioN0JH0tk1NLmVjmC850jQYhVSRA8FJwV2kbApLiK2vqHv1zZ4v8bKNIzS6TMjsll4RuJ24bu1L9+vwTumBX4y52veCdzskcDjfs8oJjT2Vg9NZuDtrlt1hst2a4Pa+h9ybaGU/QSdGWHPuS61HYfS/ODNFwak+vSDt5XU/CRQqA2v5Ulg9Z0ngSun/aNJM3z10WRGRkZGRkZGRkZGxh3xA2z8LEZ38lpUAAAAAElFTkSuQmCC" })
        await newUser.save()
        res.status(201).json({
            success: true,
            message: `User with the username ${username} succesfully added`
        })
    } catch (error) {
        // Check if the error is a duplicate key error
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            // Email already exists
            return next(errorHandler(400, 'Email Already Exists'))
        } if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
            // User with the username already exists
            return next(errorHandler(400, 'User with the Username Already Exists'))
        } 
        // Handle other errors
        next(error)
    }
}

export const signIn = async(req, res, next) => {
    const {username, email, password} = req.body
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) return next(errorHandler(404, 'User not found'))
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) return next(errorHandler(401, 'Invalid Credentials!'))
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET)
        const {password: pass, ...userInfo} = validUser._doc
        res.cookie('access_token', token, {httpOnly: true, maxAge: 3600000, sameSite: "Strict"})
        res.status(200)
        res.json(userInfo)

    } catch (error) {
        next(error)
    }
}

export const googleSignIn = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (user) {
           const token = jwt.sign({id: user._id}, process.env.JWT_SECRET) 
           const { password: pass, ...userInfo } = user._doc
           res
                .cookie('access_token', token, {httpOnly: true, expires: new Date(Date.now() + 60 * 60 *1000)})
                .status(200)
                .json(userInfo)
        } else {
            const generatedPassword =   Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo
            })
            await newUser.save()
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET) 
            console.log(token);
            const { password: pass, ...userInfo } = newUser._doc
            res
                .cookie('access_token', token, {httpOnly: true, maxAge: 3600000})
                .status(200)
                .json(userInfo)
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const signOut = (req, res, next) => {
    try {
        res.clearCookie('access_token')
        res.status(200).json({
            success: false,
            message: "User has been logged out"
        })
    } catch (error) {
        next(error)
    }
}