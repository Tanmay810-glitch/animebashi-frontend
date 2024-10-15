import React, { useState, useRef, useEffect } from 'react';
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
import {Link, Route, Routes, useNavigate} from 'react-router-dom';


import {Carousel, EditBg, EditPin, Navbar, Sidebar, UserProfile} from '../components';
import Pins from './Pins';
import { userQuery } from '../utils/data';
import { client } from '../client';
import logo from '../assets/logo.png';
import { fetchUser } from '../utils/fetchUser';



const Home = () => {

  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const userInfo = fetchUser();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  // TODO: Change the mechanism so the site is visible for those who haven't logged in as well
  
  /*
    Mechanism:
    1. Check if there is cookies in the user's browser
    2. If there are, automatically log them in.
    3. If there are not, then just display the feed.
  */

  // Handles the log in mechanism. If the user is not logged in, it will navigate them to the login screen.
  // If they are already logged in, it will show them the home screen
  useEffect(() => {
    // Create a query asking information about the user
    const query = userQuery(userInfo?.sub);

    // After we get the results from the query
    client.fetch(query)
      // Process the query
      .then((data) => {
        // And then if we get the information about the user in return, then that means the user has already logged in
        if(data[0]){
          setUser(data[0]);
          setIsUserLoggedIn(true)
          // console.log(data[0])
        } // else {
        //   // If what we get is undefined, then that means the user has not logged in. In which case, navigate them to the login page.
        //   navigate('/login');
        // }
      })
  }, [])

  useEffect(() => {
      scrollRef.current.scrollTo(0, 0)
  }, [])
  
  const handleLogin = () => {
    navigate('/login');
  }
  
  return (
    <div className='flex bg-[#393c54] md:flex-row flex-col h-screen transistion-height duration-75 ease-out'> 
      

      {/* Ṣidebar */}
      <div className='hidden md:flex h-screen flex-initial'>
        <Sidebar user = {user && user} />
      </div>
      
      {/* Navbar for mobile */}
      <div className='flex md:hidden flex-row'>

      
        <div className='p-2 w-full flex flex-row justify-between items-center shadow-md'>
          <HiMenu fontSize={40} className='cursor-pointer' onClick={() => setToggleSidebar(true)} />

          <Link to="/">
            <img src={logo} alt="logo" width={230}/>
          </Link>

          {isUserLoggedIn ? (<Link to={`/user-profile/${user?._id}`}>
            <img src={user?.image} alt="profilePic" className='w-14 h-14 rounded-full'/>
          </Link>) : (<button
                    type='button'
                    onClick={handleLogin}
                    className='bg-white text-[#06A7F7] hover:bg-[#06A7F7] hover:text-white transition duration-500 font-bold p-2 rounded-full w-28 outline-none'
                  >
                    Log In
                  </button>)}
        </div>
        {toggleSidebar && (
        <div className='fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in'>
          <div className='absolute w-full flex justify-end items-center p-2'>
            <AiFillCloseCircle fontSize={30} className='cursor-pointer' onClick={() => setToggleSidebar(false)} />
          </div>

          <Sidebar user = {user && user} closeToggle={setToggleSidebar} />
        </div>
        )}
      </div>

 

      <div className='pb-2 bg-[#393c54] flex-2 h-screen w-full overflow-y-scroll' ref={scrollRef}>

        <Routes>
          {isUserLoggedIn && <Route path='/user-profile/:userId' element={<UserProfile currentUser={user} />} />}
          {isUserLoggedIn && <Route path="/EditBg" element={<EditBg user={user} />} />}
          <Route path='/*' element={<Pins user={user && user} isUserLoggedIn={isUserLoggedIn} />} />
          {/* <Route path='/*' element={<Pins user={user && user} />} /> */}

        </Routes>
      </div>

    </div>
  )
}

export default Home