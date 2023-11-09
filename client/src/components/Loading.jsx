import React from 'react'

const Loading = ({disabled}) => {
  return (
    <button 
        type="button" 
        className="bg-indigo-500 text-white uppercase mt-5 px-5 py-3 rounded-lg flex mx-auto items-center gap-3"
        disabled={disabled}
    >
        <span>LOADING</span>
        <svg 
            className="animate-spin h-5 w-5" 
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" 
            fill="none" stroke="white"
        >
            <circle cx="12" cy="12" r="14"></circle>
        </svg>
    </button>
  )
}

export default Loading