import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
const Navbar = ({ searchTerm, setSearchTerm, user }) => {

  const navigate = useNavigate();

  if(!user) return null;

  return (
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-7'>
      <div className='flex justify-start items-center w-screen px-2 rounded-md bg-none border-none outline-none focus-within:shadow-md transistion duration-200'>
        <IoMdSearch fontSize={21} className='ml-1' />
        <input 
          type='text'
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder='Search'
          value={searchTerm}
          onFocus={() => navigate('/search')}
          className='p-2 text-white w-full bg-transparent outline-none'
        />
      </div>

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