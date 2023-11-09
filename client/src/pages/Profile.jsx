import { useRef, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getStorage, getDownloadURL,  ref, uploadBytesResumable } from 'firebase/storage'
import app from '../firebase'

import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess } from '../redux/slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { signOutStart, signOutSuccess, signOutFailure } from '../redux/slices/userSlice'


const Profile = () => {
  const dispatch = useDispatch()
  const {currentUser, loading, error, success} = useSelector(state => state.user) 

  if (!currentUser) { 
    <Navigate to='/login' />
  }
  const [file, setFile] = useState(null)
  const [ buttonDisabled, setButtonDisabled ] = useState(false)
  const [ uploadFilePerc, setUploadFilePercentage ] = useState(0)
  const [ uploadError, setUploadError ] = useState(false)
  const [ formData, setFormData ] = useState({})
  const [ updateSuccessful, setUpdateSuccessful ] = useState(false)

  const fileRef = useRef()

  useEffect(() => {
    if (file) {
      handleFile(file)
    }
  }, [file])

  const handleFile = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state-changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setUploadFilePercentage(Math.round(progress))
      },
      (error) => {
        setUploadError(true)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
          setFormData({...formData, avatar: downloadURL})
        })
      },
    )
    setTimeout(() => {
      setUploadError(false) 
    }, 2000);;
  }

  const handleInputChanged = (e) => {
    if (e.target.id === "password" && e.target.value.length < 8) {
      setButtonDisabled(true) 
    }
    setButtonDisabled(false) 
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleFormSubmission = async(e) => {
    e.preventDefault()
    
    try {
      dispatch(updateUserStart())
      setUpdateSuccessful(true)

      const res = await fetch(`http://localhost:3000/api/users/${currentUser._id}/update`, {
        method: "POST",
        credentials: "include" ,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success===false) {
        dispatch(updateUserFailure(data.message))
        setUpdateSuccessful(false)
        return
      }

      dispatch(updateUserSuccess(data))
      setUpdateSuccessful(true)
      setTimeout(() => {
        setUpdateSuccessful(false) 
      }, 5000);
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      setUpdateSuccessful(false)
    }
  }

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart())
      const currentUserId = currentUser?._id
      const res = await fetch(`http://localhost:3000/api/users/${currentUserId}/delete`, 
      {
        method: "DELETE",
        credentials: "include", // added this part
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      const data = await res.json()
      console.log(data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }

  const handleLogout = async () => {
    try {
      dispatch(signOutStart())
      const res = await fetch('http://localhost:3000/api/auth/logout')
      const data = await res.json()

      if (data.message !== "User has been logged out") {
        dispatch(signOutFailure(data.message))
        return
      }
      dispatch(signOutSuccess(data))
    } catch (error) {
      dispatch(signOutFailure(data.message))
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form 
        onSubmit={handleFormSubmission}
        className='flex flex-col gap-4'
      >
        <input
          onChange={e => setFile(e.target.files[0])} type="file" name="" id="" ref={fileRef} hidden accept='image/*' />
        <img 
          src={formData?.avatar || currentUser?.avatar} 
          alt='profile image'
          className='w-24 h-24 object-cover rounded-full cursor-pointer self-center mt-2'
          onClick={() => fileRef.current.click()}
        />
        <div className="text-center text-sm">
          {uploadError ? (
            <span className="text-red-500 font-semibold">Error uploading image</span>
          ) : uploadFilePerc > 0 &&  uploadFilePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${uploadFilePerc}%`}</span>
          ) : uploadFilePerc === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            <span className="text-xs text-gray-500">Click on image to change profile picture. Image must be less than 2MB</span>

          )}
        </div>
        <input
          onChange={handleInputChanged} 
          type="text" 
          placeholder='username' 
          id='username' 
          className='border border-gray-500 p-3 rounded-lg focus:border-0'
          defaultValue={currentUser?.username}
        />
        <input
          onChange={handleInputChanged} 
          type="email" 
          placeholder='email' 
          id='email' 
          className='border border-gray-500 p-3 rounded-lg focus:border-0'
          defaultValue={currentUser?.email}
        />
        <input
          onChange={handleInputChanged} 
          type="password" 
          placeholder='password' 
          id='password' 
          className='border border-gray-500 p-3 rounded-lg focus:border-0'
        />
        <button
          className='p-3 uppercase bg-slate-700 text-white rounded-lg hover:opacity-90 disabled:opacity-20'
          disabled={loading || buttonDisabled}
        >
          {loading? 'loading...' : 'Update Profile'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDelete} className='text-red-500 cursor-pointer'>Delete account</span>
        <span onClick={handleLogout} className='text-blue-500 cursor-pointer'>Sign out</span>
      </div>
      <p className={error ? "bg-red-300 mt-5 p-3 text-white rounded-lg" : ''}>{error? error : ""}</p>
      <p className={updateSuccessful ? "bg-green-300 mt-5 p-3 text-white rounded-lg" : ''}>{updateSuccessful ? 'User details updated successfully' : ''}</p>
    </div>
  )
}

export default Profile