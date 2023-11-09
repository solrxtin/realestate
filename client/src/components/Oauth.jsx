import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import app from '../firebase'
import { signInSuccess } from '../redux/slices/userSlice'
import { useDispatch } from 'react-redux'
 

const Oauth = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClicked = async() => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)

            const result = await signInWithPopup(auth, provider)

            const res = await fetch('http://localhost:3000/api/auth/google-login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL
                })
            })

            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/')

        } catch (error) {
            console.log('Could not sign in with google', error)
        }
    }
  return (
    <button
        type='button'
        className='uppercase bg-red-700 text-white rounded-lg p-3 hover:opacity-85'
        onClick={handleGoogleClicked}
    >
        Sign In with Google
    </button>
  )
}

export default Oauth