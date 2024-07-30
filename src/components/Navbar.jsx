import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
const Navbar = ({ searchTerm, setSearchTerm, user }) => {

  // We'll be using this to navigate to the search page
  const navigate = useNavigate();

  // Won't appear the user is not logged in.
  if(!user) return null;

  return (
    // Renders the search bar
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-screen px-2 rounded-md bg-none border-none outline-none focus-within:shadow-md transistion duration-200'>
        {/* Renders the search icon */}
        <IoMdSearch fontSize={21} className='ml-1' />

        {/* Renders the search input */}
        <input 
          type='text'
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search'
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='p-2 text-white w-full bg-transparent outline-none'
        />
      </div>

      {/* Renders the user profile and create pin buttons */}
      <div className='flex gap-3'>
        <Link to={`/user-profile/${user?._id}`} className="hidden md:block">
          <img src={user.image} alt='user' className='w-16 h-12 rounded-lg hover:shadow-xl hover:transform hover:translate-y-[-1px] hover:scale-110 transition duration-500' />
        </Link>

        <Link to={`/create-pin`} className="bg-white text-[#06A7F7] hover:bg-[#06A7F7] hover:text-white transition duration-500 rounded-lg w-12 h-12 md:w-16 md:h-12 flex justify-center items-center">
          <IoMdAdd />
        </Link>
      </div>
    </div>
  )
}

export default Navbar