import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { client } from '../client';

const Login = () => {

  const navigate = useNavigate();

  const responseGoogle = (response) => {
    const decoded = jwtDecode(response.credential);
    localStorage.setItem('user', JSON.stringify(decoded));

    const { name, picture, sub } = decoded;

    const doc = {
      _id: sub,
      _type: 'user',
      userName: name,
      image: picture,
    }

    client.createIfNotExists(doc)
      .then(() => {
        navigate('/', { replace: true });
      })
  }

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
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
          <div className='p-5'>
            <img src={logo} width="230px" alt="logo"/>
          </div>

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