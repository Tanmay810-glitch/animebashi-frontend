import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';

import { Navbar, Feed, PinDetail, CreatePin, Search, EditPin } from '../components';

const Pins = ({ user, isUserLoggedIn }) => {
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div className='px-2 md:px-5'>
      <div className='bg-[rgb(57,60,84)]'>
        <Navbar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          user={user} 
          isUserLoggedIn={isUserLoggedIn} 
        />
      </div>

      <div className='bg-[#393c54] h-full'>
        <Routes>
          <Route path='/' element={<Feed />} />
          <Route path='/category/:categoryId' element={<Feed />} />
          <Route path='/pin-detail/:pinId' element={<PinDetail user={user} isUserLoggedIn={isUserLoggedIn} />} />
          {isUserLoggedIn && <Route path='/pin-edit/:pinId' element={<EditPin user={user} />} />}
          {isUserLoggedIn && <Route path='/create-pin' element={<CreatePin user={user} />} />}
          <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Pins