import React from 'react';
import Masonry from 'react-masonry-css';
import Pin from './Pin';

// This handles layout configurations for different screen sizes.
const breakpointObj = {
  default: 3,
  4000: 8,
  3000: 6,
  2000: 3,
  1200: 3,
  1000: 2,
  500: 1,
}

const MasonryLayout = ({pins}) => {
  return (
    // The Masonry element will handle rendering the layout
    <Masonry className='flex animate-slide-fwd' breakpointCols={breakpointObj}>
      {/* 
        In the parameter on the MasonryLayout function we are sending a parameter called "pins", which is an array of all the fetched pins.
        
        The below code will take each pin, and render it in the Pin Element. 
       */}
      {pins?.map((pin) => <Pin key={pin?._id} pin={pin} className="max-w-full" />)}
    </Masonry>
  )
}

export default MasonryLayout