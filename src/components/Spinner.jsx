import React from 'react';
import {Grid} from 'react-loader-spinner';

const Spinner = ({message}) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <Grid 
        type="Circles"
        color="#00BFFF"
        height={50}
        width={200}
        className="m-5"
      />

      <p className='text-lg text-white text-center px-2 py-2'>{message}</p>

    </div>
  )
}

export default Spinner