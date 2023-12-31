import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages
import Home from './pages/Home'
import About from './pages/About'
import Profile from './pages/Profile'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'

// components
import Header from './components/Header'
import PrivateRouter from './components/PrivateRouter'
import CreateListing from './pages/CreateListing'
import Users from './pages/Users'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/register' element={<SignUp />} />
        <Route path='/login' element={<SignIn />} />
        <Route path='/users' element={<Users />} />
        <Route element={<PrivateRouter />} >
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App