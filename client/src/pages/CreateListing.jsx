import React, { useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import app from '../firebase'

let imageCount = 0

const CreateListing = () => {
  const [files, setFiles] = useState([])
  const [ formData, setFormData ] = useState({
    name: '',
    description: '',
    address: '',
    sale: false,
    rent: false,
    parking: false,
    furnished: false,
    offer: false,
    beds: 1,
    baths: 1,
    regularPrice: 0,
    discountedPrice: 0,
    imageUrls: [],
  })
  const [ imageUploadError, setImageUploadError ] = useState('')
  const [uploading, setUploading] = useState(false)
  const handleImageSubmission = () => {
    if (files.length > 0 && files.length + formData.files.length<= 6) {
        setUploading(!uploading)
        const promises = []

        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            promises.push(storageItem(element))
        }
        Promise.all(promises)
            .then(urls => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)})
                setImageUploadError('')
                setUploading(false)
            })
            .catch(err => {
                setImageUploadError('Image upload failed (2 mb max per image)')
                setUploading(false)
            })
    } else {
        setImageUploadError('You must upload at least 1 image and can only upload 6 images per listing')
        setUploading(false)
    }
  }

  const storageItem = async (file) => {
    return new Promise((resolve, reject) => {
        const storage = getStorage(app)
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, file)
        uploadTask.on(
            "state_changed",
            snapshot => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log(`Upload is ${progress}% done`)
            },
            (error) => {
                reject(error)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(downloadURL => resolve(downloadURL))
            }
        )
    })
  }

  const handleChange = (e) => {

  }

  return (
    <main>
        <h1 className="font-semibold text-3xl text-center my-7">Create a Listing</h1>
        <form className="flex flex-col sm:flex-row m-5 gap-4">
            <div className='flex flex-col gap-4 flex-1'>
                <input 
                    type="text" 
                    className="border rounded-lg p-3" placeholder='Name' 
                    id='name' 
                    maxLength='62' 
                    minLength={10} 
                    value={formData.name} 
                    onChange={handleChange} 
                    required
                />
                <textarea 
                    className="border rounded-lg p-3" placeholder='Description' id='description' 
                    required
                    value={formData.description}
                    onChange={handleChange}
                />
                <input 
                    type="address" 
                    className="border rounded-lg p-3" placeholder='Address' 
                    id='address' 
                    maxLength='255' 
                    required
                    value={formData.address}
                />
                <div className='flex gap-6 flex-wrap'>
                    <div className="flex gap-1 items-center">
                        <input 
                            type="checkbox" 
                            className='w-5'  
                            id="sale"
                            checked={formData.type==='sale'}
                            onChange={handleChange}
                        />
                        <span>Sell</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <input 
                            type="checkbox" 
                            className='w-5'
                            id="rent" 
                            checked={formData.type==='rent'}
                            onChange={handleChange}
                        />
                        <span>Rent</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <input 
                            type="checkbox" 
                            className='w-5' 
                            id="parking" 
                            checked={formData.parking}
                            onChange={handleChange}
                        />
                        <span>Parking Lot</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <input 
                            type="checkbox" 
                            className='w-5' 
                            id="furnished" 
                            checked={formData.furnished}
                            onChange={handleChange}
                        />
                        <span>Furnished</span>
                    </div>
                    <div className="flex gap-1 items-center">
                        <input 
                            type="checkbox" 
                            className='w-5' 
                            id="offer" 
                            checked={formData.offer}
                            onChange={handleChange}
                        />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex gap-1 items-center'>
                        <input 
                            type="number"  
                            id="beds" 
                            min='1' 
                            max='10' 
                            required className='border border-gray-300 p-3 rounded-lg'
                            value={formData.beds}
                            onChange={handleChange}
                        />
                        <span>Bed</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <input 
                            type="number" 
                            id="baths" 
                            className='border border-gray-300 rounded-lg p-3' 
                            min={1} 
                            max={10}
                            required
                            value={formData.baths}
                            onChange={handleChange}
                        />
                        <span>Baths</span>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <input 
                            type="number" 
                            id="regular" 
                            className='border border-gray-300 p-3 rounded-lg'
                            required
                            value={formData.regularPrice}
                            onChange={handleChange}
                        />
                        <div className='flex flex-col'>
                            <p>Regular price</p>
                            <span className='text-xs'>($/Month)</span>
                        </div>
                    </div>
                    <div className='flex gap-1 items-center'>
                        <input 
                            type="number"  
                            id="discount" 
                            className='border border-gray-300 p-3'
                            value={formData.discountedPrice}
                            onChange={handleChange}
                        />
                        <div className='flex flex-col'>
                            <p>Regular price</p>
                            <span className='text-xs'>($/Month)</span>
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1'>
                <span className="font-semibold">Images:</span>
                <span className="font-normal text-gray-600 ">The first image will be the cover (max 6)</span>
                <div className="flex gap-2">
                    <input onChange={(e) => setFiles([...files, e.target.value])} type="file" name="" id="" accept='image/*' multiple className='p-2 border border-gray-300 w-full'/>
                    <button type='button' onClick={handleImageSubmission} className='p-2 text-green-700 border border-gray-300 rounded uppercase hover:bg-green-500 hover:text-white disabled:opacity-20' >upload</button>
                    {imageUploadError && <p className={imageUploadError ? 'bg-red-300 text-white p-2 text-xs' :''}> {imageUploadError} </p>}
                    {
                        formData.imageUrls.length > 0 && !imageUploadError && formData.imageUrls.map(url => {
                            <div className='flex justify-between items-center m-2 border border-b-1 border-gray-200' key={url + imageCount}> 
                                <img className='w-20 h-20 object-contain rounded-lg' src={url} alt="image" />
                                <button className='text-red-600 p-2 rounded' type="button">Delete</button>
                            </div>
                        })
                    }
                </div>
                <button type='submit' className="bg-slate-700 text-white uppercase text-center p-3 rounded-lg w-full mt-5">create listing</button>
            </div>
        </form>
    </main>
  )
}

export default CreateListing