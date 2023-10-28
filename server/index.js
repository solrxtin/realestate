import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import userRouter from './api/routes/user.js'

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to database"))
    .catch(err => console.error(err))

const app = express()

const PORT = process.env.PORT

app.listen(PORT || 4000, () => {
    console.log("Server running on ", PORT)
})

app.get('/', (req, res) => {
    res.json({message: 'Hello world!'})
})

app.use('/api/users', userRouter)