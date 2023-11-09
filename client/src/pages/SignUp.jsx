import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signUpSuccess } from '../redux/slices/userSlice'


import Oauth from '../components/Oauth'
import Loading from '../components/Loading'



const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [ error, setError ] = useState(null)
  const [ loading, setLoading ] = useState(false)

  const navigate = useNavigate() 
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  
  const handleSubmit = async(e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const res = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
  
      if (data.success === false) {
        setError(data.message)
        setLoading(false)
        setTimeout(() => {
          setError(null)
        }, 5000);
        return 
      }
  
      setLoading(false)
      setError(null)
      dispatch(signUpSuccess(data))
      navigate('/login') 
    } catch (error) {
      console.log(error)
      setLoading(false) 
      setError(error.message) 
      setTimeout(() => {
        setError(null)
      }, 5000);
    }
  } 
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl text-center font-semibold my-7">
        Sign Up
      </h1>
      <form className='flex flex-col space-y-4' onSubmit={handleSubmit}>
        <input onChange={handleChange} className='border p-3 rounded-lg' type='text' placeholder='Username' id='username'/>
        <input onChange={handleChange} className='border p-3 rounded-lg' type="email" placeholder='Email' id='email'/>
        <input onChange={handleChange} className='border p-3 rounded-lg' type="password" placeholder='Password' id='password'/>
        {loading ? 
          <Loading disabled={loading}/> :
          <button className='bg-slate-700 text-white p-3 rounded-r-lg uppercase hover:opacity-80 disabled:opacity-10' disabled={loading}>
            Sign Up
          </button>
        }
        <Oauth />
      </form>
      <div className='flex space-x-2 mt-5 items-center'>
        <p className='text-sm'>Have an account?</p>
        <Link to={'/login'}>
          <span className='text-blue-700 text-xs'>Sign In</span>
        </Link>
        
      </div>
      {error && <div className={error && 'bg-red-300  text-white p-3 mt-3 rounded-lg truncate'}>{error}</div>}
    </div>
  )
}

export default SignUp