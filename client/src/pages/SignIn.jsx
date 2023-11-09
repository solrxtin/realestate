import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { signInFailure, signInSuccess, signInStart, signOutSuccessAlt, signUpSuccessAlt, signInFailureAlt } from '../redux/slices/userSlice'

import Oauth from '../components/Oauth'
import Loading from '../components/Loading'


const SignIn = () => {
  const [formData, setFormData] = useState({})
  const [ disableButton, setDisableButton ] = useState(true)
  const { loading, error, success } = useSelector(state => state.user )

  const navigate = useNavigate() 
  const dispatch = useDispatch()

  window.setTimeout(() => {
    dispatch(signUpSuccessAlt())
    dispatch(signInFailureAlt())
  }, 5000)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
    if (e.target.id === "email" && e.target.value.length < 1) {
      setDisableButton(true)
      return
    }
    if (e.target.id === "password" && e.target.value.length < 8) {
      setDisableButton(true)
      return
    }
    if (formData['email'] !== undefined && formData['password'] !== undefined && formData['email'].length >= 1 && formData['password'].length >= 7 ) {
      setDisableButton(false)
    }
  }
  const handleSubmit = async(e) => {
    try {
      e.preventDefault()
      dispatch(signOutSuccessAlt())
      dispatch(signInStart())
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
  
      if (data.success === false) {
        dispatch(signInFailure(data.message))
        return 
      }
  
      dispatch(signInSuccess(data))
      navigate('/') 
    }
    catch (error) {
      dispatch(signInFailure(error.message))
    }
  } 

  return (
    <div className='p-3 max-w-lg mx-auto'>
      {success &&
      <div className={success&& 'bg-green-300 text-white p-2 rounded-lg text-center mt-3'} >{success}</div> }
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign In
      </h1>
      <form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
        <input onChange={handleChange} className='border p-3 rounded-lg' type="email" placeholder='Email' id='email'/>
        <input onChange={handleChange} className='border p-3 rounded-lg' type="password" placeholder='Password' id='password'/>
        {loading ? 
          <Loading disabled={loading} />
         :
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-10' disabled={loading || disableButton}>
            Sign In
          </button>
        }
        <Oauth />
      </form>
      <div className='flex space-x-2 mt-5 items-center'>
        <p className='text-sm'>Dont have an account yet?</p>
        <Link to={'/register'}>
          <span className='text-blue-700 text-xs'>Sign Up</span>
        </Link>
      </div>
      {error && <div className={error && 'bg-red-300  text-white p-3 mt-3 rounded-lg truncate'}>{error}</div>}
    </div>
  )
}

export default SignIn