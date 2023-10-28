import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to database"))
    .catch(err => console.error(err))

const app = express()

const PORT = process.env.PORT

app.listen(PORT || 4000, () => {
    console.log("Server running on ", PORT)
})