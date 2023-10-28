import express from 'express'
import userController from '../controllers/user.js'

const router = express.Router()

router.get('/user', userController)

export default router