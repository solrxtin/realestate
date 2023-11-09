import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import userRouters from './api/routes/user.js'
import authRouters from './api/routes/auth.js'
import listingRouters from './api/routes/listing.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to database"))
    .catch(err => console.error(err))

const app = express()
app.use(express.json())
app.use(cookieParser())
const corsOptions = {
    origin: ['http://localhost:5173'], // Allow requests from the set origin
    credentials: true, // Include cookies and credentials
};
  
app.use(cors(corsOptions));
  

const PORT = process.env.PORT

app.listen(PORT || 4000, () => {
    console.log("Server running on ", PORT)
})

app.get('/', (req, res) => {
    res.json({message: 'Hello world!'})
})

// Routes
app.use('/api/users', userRouters)
app.use('/api/auth', authRouters)
app.use('/api/listings', listingRouters)

// Middleware

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})