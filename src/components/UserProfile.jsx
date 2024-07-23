import React, {useState, useEffect} from 'react';
import { AiFillEdit, AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery, userBgQuery } from '../utils/data';
import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const randomImage = 'https://source.unsplash.com/1600x900/?nature,photography,technology';

const activeBtnStyles = "bg-[#06A7F7] text-white font-bold p-2 rounded-full w-20 transition duration-500 outline-none";
const notActiveBtnStyles = "bg-primary text-white font-bold p-2 rounded-full w-20 transition duration-500 outline-none";

const UserProfile = () => {

  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [userBg, setUserBg] = useState(null);
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');
  const navigate = useNavigate();
  const { userId } = useParams();


  // For fetching user information on page load
  useEffect(() => {
    const query = userQuery(userId);
  
    client.fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
  }, [userId])

  // For fetching user created/saved pins
  useEffect(() => {
    if(text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery)
        .then((data) => {
          setPins(data);
        })
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery)
        .then((data) => {
          setPins(data);
        })
    }
  }, [text, userId])

  // For fetching user bg
  useEffect(() => {
    const query = userBgQuery(userId);
  
    client.fetch(query)
      .then((data) => {
        // console.log("Following are the contents of user bg: ",data);
        setUserBg(data[0]);
      })

  }, [userId])



  

  const handleLogout = () => {
    localStorage.clear();
    googleLogout();

    navigate('/login');
  }

  const handleEditBg = () => {
    navigate('/EditBg');
  }
  

  if(!user) {
    return <Spinner message="Loading profile..." />
  }

  return (
    <div className='relative pb-2 h-full justify-center items-center'>
      {/* Renders user info and posts */}
      <div className='flex flex-col pb-5'>
        <div className='relative flex flex-col mb-7'>

          {/* Renders the main bg, the profile pic, the name of the user, and the log out button */}
          <div className='flex flex-col justify-center items-center'>
            {/* The main bg image */}
            <img 
              src={userBg?.image?.asset?.url}
              className='w-screen h-370 shadow-lg object-cover'
              alt='banner-pic'
            />

            {/* The profile pic of the user */}
            <img 
              className='rounded-full w-20 h-20 -mt-10 shadow-xl object-cover'
              src={user.image}
              alt='user-pic'
            />

            {/* The name of the user */}
            <h1 className='font-bold text-3xl text-center text-white mt-3 mb-3'>
              {user.userName}
            </h1>

            {/* If the user is logged in, then render a log out button for them */}
            <div className='absolute top-0 z-1 right-0 p-2'>
              {userId === user._id && (
                <button 
                className='bg-white p-2 rounded-full cursor-pointer shadow-empty'
                  onClick={handleLogout}
                >

                <AiOutlineLogout color='red' fontSize={21} />
                </button>
              )}
            </div>

            {/* If the user is logged in, then render an edit button to change the main bg */}
            <div className='absolute top-0 z-1 left-0 p-2'>
              {userId === user._id && (
                <button 
                className='bg-white p-2 rounded-full cursor-pointer shadow-empty'
                  onClick={handleEditBg}
                >
                  <Link to="/EditBg">
                    <AiFillEdit color='grey' fontSize={21} />
                  </Link>
                </button>
              )}
            </div>
          </div>
          
          {/* Renders button for toggling between "Created" and "Saved" posts */}
          <div className='text-center mb-7'>
              <button
                type='button'
                onClick={(e) => {
                  setText(e.target.textContent)
                  setActiveBtn('created')
                }}
                // Below logic: Is the "activeBtn" class active on the "created" button?
                // If yes, then render it with active button style, 
                // Or else, the default button style
                className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
              >
                Created
              </button>

              <button
                type='button'
                onClick={(e) => {
                  setText(e.target.textContent)
                  setActiveBtn('saved')
                }}
                // Below logic: Is the "activeBtn" class active on the "saved" button?
                // If yes, then render it with active button style, 
                // Or else, the default button style
                className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles} ml-2`}
              >
                Saved
              </button>
          </div>

          {/* Renders pins, if there are any */}
          {pins?.length ? (
            <div className='px-2'>
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className='flex justify-center font-bold items-center w-full text-xl mt-2'>
              No Pins Found
            </div>
          )}



        </div>
      </div>
    </div>
  )
}

export default UserProfile