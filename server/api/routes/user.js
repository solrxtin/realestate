import express from 'express'
import userController from '../controllers/user.js'
import { updateUser, deleteUser } from '../controllers/user.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.get('/user', userController)
router.post('/:id/update', verifyToken, updateUser)
router.delete('/:id/delete',verifyToken, deleteUser)

export default router