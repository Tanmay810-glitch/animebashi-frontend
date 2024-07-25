import React, {useState, useEffect} from 'react';
import { MdDownloadForOffline, MdEdit } from 'react-icons/md';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import {client, urlFor} from '../client'
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { AiFillEdit } from 'react-icons/ai';

const PinDetail = ({user}) => {

  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const navigate = useNavigate();
  const { pinId } = useParams();
  const { userId } = useParams();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
        });
    }
  };

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if(query) {
      client.fetch(query)
        .then((data) => {
          setPinDetail(data[0]);


          if(data[0]) {
            query = pinDetailMorePinQuery(data[0]);

            client.fetch(query)
              .then((res) => setPins(res))
          }
        })
    }
  }

  const handleEditPin = () => {
    navigate('/EditPin');
  }

  useEffect(() => {
    fetchPinDetails();
  }, [pinId])

  if(!pinDetail) return <Spinner message="Loading pin..." />

  return (
    <>

      {/* Render the whole pin detail page  */}
      <div className='flex xl:flex-column flex-col m-auto bg-[#2A2C3E]' style={{maxWidth: '1500px', borderRadius: '32px'}}>

          {/* Render the edit button */}
          {/* <div 
            className='absolute bg-white p-2 right-12 top-28 rounded-full cursor-pointer shadow-empty'
            onClick={() => navigate(`/pin-edit/${pinId}`)}
            >
            <Link to={'/EditPin'}>
              <AiFillEdit color='grey'fontSize={21}/>
            </Link>
          </div> */}
    
        {/* Render the pin */}
        <div className='flex justify-center items-center md:items-start flex-initial'>


          <img 
            src={pinDetail?.image?.asset?.url} 
            className='rounded-t-3xl rounded-b-lg w-full'
            alt='user-post'
          />
        </div>

        {/* Render the pin and user details, and the comment section */}
        <div className='w-full p-5 flex-1 xl:min-w-620'>

          {/* Render the download button and the image's source link (Remove this feature)*/}
          {/* <div className='flex items-center justify-between'>*/}

            {/* Render the download button */}
            {/* <div className='flex gap-2 items-center'>
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className='bg-white w-7 h-7 rounded-full flex items-center justify-center text-dark text-9xl opacity-75 hover:opacity-100 hover:shadow-md outline-none '
              >
                <MdDownloadForOffline />
              </a>
            </div> */}

            {/* Render the source link of the image */}
            {/* <a href={pinDetail.destination} target='blank' rel='noreferrer'>
              {pinDetail.destination.slice(0, 30).concat("...")}
            </a> */}
          {/*</div> */}

          {/* Render the details of the pin */}
          <div>

            {/* Render the title of the pin */}
            <h1 className='text-4xl text-center text-white font-bold break-words mt-3'>
              {pinDetail.title}
            </h1>

            {/* Render the description of the pin */}
            <p className='mt-3 text-center text-white'>
              {pinDetail.about}
            </p>
          </div>

          {/* Render the details of the user who posted the pin */}
          <Link to={`/user-profile/${pinDetail.postedBy?._id}`}  className="flex gap-2 mt-5 items-center bg-[#2A2C3E] text-white hover:text-[#06A7F7] rounded-lg">

            {/* The user's profile pic */}
            <img 
              className='w-8 h-8 rounded-full object-cover'
              src={pinDetail.postedBy?.image}
              alt='user-profile'
            />

            {/* Ṭhe user's name */}
            <p className='font-semibold capitalize text-sm'>{pinDetail.postedBy?.userName}</p>
          </Link>

          {/* For rendering the comment section */}
          <h2 className='mt-5 text-2xl text-white'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>

            {/* Ṛender comments from other users, if any */}
            {pinDetail?.comments?.map((item) => (
                  <div className="flex gap-2 mt-5 items-center bg-[#2A2C3E] rounded-lg" key={item.comment}>
                    {/* Render Profile pic of the poster */}
                    <img
                      src={item.postedBy?.image}
                      className="w-10 h-10 rounded-full"
                      alt="user-profile"
                    />

                    {/* Render the name of the poster who posted the comment, and their comment */}
                    <div className="flex flex-col">
                      <p className="font-bold text-white">{item.postedBy?.userName}</p>
                      <p className='text-white'>{item.comment}</p>
                    </div>
                  </div>
                ))}
          </div>

          {/* Renders the comment input field (The pic of the poster, input field, and the button for posting the comment) */}
          <div className='flex flex-wrap mt-6 gap-3'>

            {/* Renders the profile pic of the user who is posting the comment, and provides a link to their profile */}
            <Link to={`/user-profile/${user._id}`}>
              <img 
                className='w-10 h-10 rounded-full cursor-pointer'
                src={user?.image}
                alt='user-profile'
              />
            </Link>

            {/* Renders the input field for the comment */}
            <input 
              className=" flex-1 border-gray-100 text-white bg-[#393c54] outline-none border-2 p-2 rounded-2xl focus:border-[#06A7F7] transition duration-500"
              type="text"
              placeholder="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Renders the button for posting the comment */}
            <button
              type="button"
              className="bg-white text-[#06A7F7] hover:bg-[#06A7F7] hover:text-white transition duration-500 rounded-full px-6 py-2 font-semibold text-base outline-none"
              onClick={addComment}
            >
              {addingComment ? 'Posting the comment' : 'Post'}
            </button>
          </div>
        </div>
      </div>
      {/* {console.log(pins)} */}

      
      {
        // If there are pins with the same category as this one, render them below
        pins?.length > 0 ? (
          /* The "More like this" part below the detailed pin */
          <>
            <h1 className='text-center font-bold text-2xl text-white mt-8 mb-4'>
              More like this
            </h1>
              <MasonryLayout pins={pins} />
          </>
      ) :(
        <Spinner message="Loading more pins..." />
      )}
    </>
  )
}

export default PinDetail