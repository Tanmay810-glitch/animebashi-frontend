import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {v4 as uuidv4} from 'uuid';
import {MdDownloadForOffline} from 'react-icons/md'
import { AiTwotoneDelete } from 'react-icons/ai';
import {BsFillArrowUpCircleFill} from 'react-icons/bs';
import { client, urlFor } from '../client'
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, title, save, about } }) => {

  const [postHovered, setPostHovered] = useState(false);


  const navigate = useNavigate();

  const user = fetchUser(); 



  // The below code will originally either return a 1 (Value in array) or a 0 (Empty array). We need to convert those numbers into boolean
  // That's why we added the !!
  // It works like this:
  // 0 -> !0 -> true -> !true -> false
  // 1 -> !1 -> false -> !false -> true
  const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.sub))?.length;

  const savePin = (id) => {
    if(!alreadySaved) {


      client
        .patch(id)
        .setIfMissing({save: []})
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user.sub,
          postedBy: {
            _type: 'postedBy',
            _ref: user.sub
          }
        }])
        .commit()
        .then(() => {
          window.location.reload();
        })
    }
  }

  const deletePin = (id) => {
    client 
      .delete(id)
      .then(() => {
        window.location.reload();
      })

  }


  return (
    <div className='m-2 '>
        {/* Renders the pin */}
        <div
          onMouseEnter={() => setPostHovered(true)}
          onMouseLeave={() => setPostHovered(false)}
          onClick={() => navigate(`/pin-detail/${_id}`)}
          className='relative rounded-xl cursor-pointer bg-[#2A2C3E] mt-4 shadow-md transition-all duration-400 overflow-hidden hover:shadow-xl hover:transform hover:translate-y-[-1px] hover:scale-105 hover:z-10'
        >
          
          {/* Render the image */}
          <div className='m-0 p-0 overflow-hidden'> 
            <img className='w-full origin-center scale-100 transition-transform duration-400 ease-in-out' alt='user-post' src={`${image?.asset?.url}`} />
          </div>
          {/* urlFor(image).width(250).url() */}

           {/*Render the image title, description, and user profile pic */}
          <div>
            {/*Render the image title */}
            <h3 className='m-0 pl-2 pt-2 text-xl font-bold text-white hover:text-[#06A7F7] transition-color duration-300 ease-out'>{title}</h3>

            {/*Render the image description */}
            <p className='p-1 pl-2 pb-3 text-white'>{about?.slice(0,100)}...</p>
          </div>

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