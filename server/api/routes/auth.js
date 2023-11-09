import express from 'express'
import {signIn, signUp, googleSignIn, signOut} from "../controllers/auth.js";

const router = express.Router()


router.post('/register', signUp)
router.post('/login', signIn) 
router.post('/google-login', googleSignIn)
router.get('/logout', signOut)

export default router
