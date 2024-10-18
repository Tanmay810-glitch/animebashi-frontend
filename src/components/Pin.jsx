import React, {useEffect, useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {MdDownloadForOffline} from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai';
import {BsFillArrowUpCircleFill} from 'react-icons/bs';
import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, title, save, about } }) => {

  // const [postHovered, setPostHovered] = useState(false);

  // Hook for setting the font size of title and description according to the image size.
  const [fontSize, setFontSize] = useState(0);
  
  /*UI UPDATE: I have made it so that instead of displaying the title and description of a pin in a separate div, there will be an overlay on the image itself on which the two will be displayed. But the font needs to vary as per the size of the image. And so I have come up with an algorithm to manage that.
  
  1. This function will be invoked when an image is hovered upon.
  2. And will calculate the height and the width of the image.
  3. Multiply it, and store the product in a variable named "totalSize".
  4. The size of the fonts will be 1000th the value of totalSize.
  5. But there will be edge cases where the height of the image is too big. 
  6. And that will result in big fonts as well.
  7. For that case, we will set a certain threshold for maximum height of around 300.
  8. If the totalSize crosses that threshold, we cut down the original height of the image by a factor of  1.5
  9. If it is within the maximum height threshold, then we will have a minimum threshold set in place of around 150. 
  10. If it is below the minimum height threshold, we increase the original height by a multiple of 1.3

  */ 
  const calculateFontSize = (event) => {
    const image = event.target;
    const width = image.offsetWidth;
    const height = image.offsetHeight > 300 ? image.offsetHeight/1.5 : (image.offsetHeight < 150 ? image.offsetHeight*1.3 : image.offsetHeight)
    const totalSize = width * height;
    const fontSize = totalSize / 1000; // adjust the divisor as needed
    setFontSize(fontSize);
  };





  const navigate = useNavigate();

  // const user = fetchUser(); 



  // The below code will originally either return a 1 (Value in array) or a 0 (Empty array). We need to convert those numbers into boolean
  // That's why we added the !!
  // It works like this:
  // 0 -> !0 -> true -> !true -> false
  // 1 -> !1 -> false -> !false -> true
  // const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.sub))?.length;

  // const savePin = (id) => {
  //   if(!alreadySaved) {


  //     client
  //       .patch(id)
  //       .setIfMissing({save: []})
  //       .insert('after', 'save[-1]', [{
  //         _key: uuidv4(),
  //         userId: user.sub,
  //         postedBy: {
  //           _type: 'postedBy',
  //           _ref: user.sub
  //         }
  //       }])
  //       .commit()
  //       .then(() => {
  //         window.location.reload();
  //       })
  //   }
  // }

  // const deletePin = (id) => {
  //   client 
  //     .delete(id)
  //     .then(() => {
  //       window.location.reload();
  //     })

  // }


  return (
    <div className='m-2 '>
        {/* Renders the pin */}
        <div
          // onMouseEnter={() => setPostHovered(true)}
          // onMouseLeave={() => setPostHovered(false)}
          onClick={() => navigate(`/pin-detail/${_id}`)}
          className='relative rounded-xl cursor-pointer bg-[#2A2C3E] mt-4 shadow-md transition-all duration-400 overflow-hidden hover:shadow-xl hover:transform hover:translate-y-[-1px] hover:scale-105 hover:z-10'
        >
          
          {/* Render the image */}
          <div className='m-0 p-0 overflow-hidden'> 
            <img className='w-full origin-center scale-100 transition-transform duration-400 ease-in-out' alt='user-post' src={`${image?.asset?.url}`} onMouseOver={calculateFontSize} 
            />
            {/* Overlay container */}
            <div className="absolute bottom-0 left-0 w-full p-2 bg-gradient-to-t from-black to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 ease-out">
                {/* Image title */}
                <h3 className="font-bold text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] hover:text-[#06A7F7] transition-color duration-300 ease-out" style={{ fontSize: `${fontSize/3.4}px` }}

                     >
                  {title}
                </h3>
                
                {/* Image description */}
                <p className=" text-white"
                   style={{ fontSize: `${fontSize/4.5}px` }}
                >
                  {about?.slice(0,100)}...
                </p>
              </div>
          </div>
          {/* urlFor(image).width(250).url() */}


           {/* Renders the user profile pic under the pin */}
          {/* <Link to={`/user-profile/${postedBy?._id}`}  className="flex gap-2 mt-2 pl-2 pb-3 items-center">
            <img 
              className='w-7 h-7 rounded-full object-cover'
              src={postedBy?.image}
              alt='user-profile'
            />
            <p className='font-semibold capitalize text-white text-sm'>{postedBy?.userName}</p>
  
          </Link> */}
          


        </div>


    </div>
  )
}

export default Pin