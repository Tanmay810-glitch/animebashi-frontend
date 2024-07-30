import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

// Handles the login functionality
const Login = () => {
  // We use this to navigate to the homepage after the user successfully logs in
  const navigate = useNavigate();


  const responseGoogle = (response) => {
    // We ask for the user's data
    const decoded = jwtDecode(response.credential);

    // We store the data inside the user's local storage so they don't have to login again on the same device, if they have already done it once.
    localStorage.setItem('user', JSON.stringify(decoded));

    // We extract the name, pic, and the id of the user
    const { name, picture, sub } = decoded;

    // We create a document with that info
    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    }

    // If the document (in other words, the user) doesn't exist, we create one, and then navigate to the home page 
    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', { replace: true });
      })
  }

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        {/* We render the video that plays in the background */}
        <video 
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'> 
          {/* Ṛenders the logo */}
          <div className='p-5'>
            <img src={logo} width="230px" alt="logo"/>
          </div>

          {/* Renders the login button (The entire login process is handled by Google) */}
          <div className='shadow-2xl'>
            <GoogleOAuthProvider 
              clientId= {process.env.REACT_APP_GOOGLE_API_TOKEN}

            >
              {/* <button
                  type='button'
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg curor-pointer outline-none"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy="single_host_origin"
              >
                  <FcGoogle className='mr-4' /> Sign in with Google
              </button> */}
              
              <GoogleLogin
                onSuccess={responseGoogle}
                onError={responseGoogle}
              />;
            </GoogleOAuthProvider>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login