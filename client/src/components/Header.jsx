import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'



const Header = () => {
  const { currentUser } = useSelector(state => state.user)
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
                <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                    <span className='text-slate-500'>Richville</span>
                    <span className='text-slate-700'>Estate</span>
                </h1>
            </Link>
            <div>
                <form className='flex items-center p-1 rounded-lg bg-slate-100'>
                    <input type="text" name="" id="" placeholder='search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
                    <FaSearch />
                </form>
            </div>
            <ul className='flex space-x-3'>
                <Link to='/'>
                    <li className='text-slate-700 hidden sm:inline hover:underline' >Home</li>
                </Link>
                <Link to='/about'>
                    <li className='text-slate-700 hidden sm:inline hover:underline'>About</li>
                </Link>
                {currentUser? (
                    <Link to='/profile'>
                        <img 
                            src={currentUser?.avatar} alt='profile'
                            className='w-7 h-7 rounded-full object-cover'
                        />
                    </Link>
                ) : (
                    <Link to='/login'>
                        <li className='text-slate-700 hover:underline'>Login</li>
                    </Link>
                )}
            </ul>
        </div>
    </header>
  )
}

export default Header