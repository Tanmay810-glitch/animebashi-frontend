import React, {useState, useEffect} from 'react';
import { MdDownloadForOffline, MdEdit } from 'react-icons/md';
import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import {client, urlFor} from '../client'
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';
import { AiFillBook, AiFillDelete, AiFillEdit, AiFillFileMarkdown, AiFillSave, AiOutlineLogout } from 'react-icons/ai';
import { CiBookmarkPlus, CiBookmarkCheck } from "react-icons/ci";


const PinDetail = ({user, isUserLoggedIn}) => {

  const [pins, setPins] = useState(null)
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [pinUserId, setPinUserId] = useState(null)
  const [goingToDelete, setGoingToDelte] = useState(false);
  const [savedPin, setSavedPin] = useState(false);
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

  const handleSavePin = async (pinId) => {
    try {
      if (!pinId || !user?.googleId) return;
  
      const response = await client.patch(pinId)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            postedBy: { _type: 'postedBy', _ref: user.googleId },
            userId: user.googleId,
          },
        ])
        .commit()
        
  
      // No need to reload the entire page; update your state instead
      // window.location.reload();
  
      // Update your state here, e.g., setSavingPost(false)
      console.log(response)
      console.log('Pin saved successfully!');
    } catch (error) {
      console.error('Error saving pin:', error);
    }
  };
  
  // const handleSavePin = (pinId) => {
  //   // if (alreadySaved?.length === 0) {
  //     // setSavingPost(true);

  //     client
  //       .patch(pinId)
  //       .setIfMissing({ save: [] })
  //       .insert('after', 'save[-1]', [{
  //         _key: uuidv4(),  
  //         postedBy: {
  //           _type: 'postedBy',
  //           _ref: user?.googleId,
  //         },
  //         userId: user?.googleId,
  //       }])
  //       .commit()
  //       .then(() => {
  //         window.location.reload();
  //         // setSavingPost(false);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       })
    
  // };

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if(query) {
      client.fetch(query)
        .then((data) => {
          setPinDetail(data[0]);
          setPinUserId(data[0].postedBy._id)

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

  const handleDelete = () => {
    // This will allow the pop-up box asking the user if they are sure about deleting post, will appear
    setGoingToDelte(true)
  }

  useEffect(() => {
    fetchPinDetails();
  }, [pinId])

  if(!pinDetail) return <Spinner message="Loading pin..." />

  return (
    
    <>

      {/* Render the whole pin detail page  */}
      <div className='flex xl:flex-column flex-col m-auto bg-[#2A2C3E]' style={{maxWidth: '1500px', borderRadius: '32px'}}>
  
    
        {/* Render the pin */}
        <div className='flex relative justify-center items-center md:items-start flex-initial'>

        {/* Conditional Render: It will only appear if the user clicks on the delete icon, setting goingToDelete to true */}
        {goingToDelete && <div className='absolute z-10 flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 rounded-t-3xl bg-blackOverlay'>

            <div className='bg-white rounded-lg flex flex-col items-center p-4 transition-all animate-in slide-in-from-top-20'>
                <h1 className='text-2xl font-bold my-2'>
                  Warning!
                </h1>

                <hr className='w-80 border-t border-gray-950 my-1'/>

                <p className='my-2'>
                  Are you sure you want to delete the post?
                </p>

                <p className='text-sm text-gray-500 my-2'>(Note: It may take a while to delete)</p>

                <div className='flex flex-row my-2'>


                  {/* If the user clicks no, the goingToDelete will be set to false, and the pop-up box will go away */}
                  <button 
                    className='mr-5 py-2 w-28 rounded-full bg-secondaryColor cursor-pointer outline-none hover:shadow-lg transition-all duration-500 ease-in-out'
                    onClick={() => setGoingToDelte(false)}
                  >
                    No
                  </button>

                   {/* If the user clicks on yes, we delete the post */}
                    <button 
                    className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
                    onClick={()=>{
                      client.delete(pinId)
                      .then(() => {
                        window.alert('Post deleted')
                        navigate('/');
                      })
                      .catch((err) => {
                        window.alert("The post didn't get deleted becuase: ", err.message)
                      })
                    }}  
                  >
                    Yes
                  </button>

                </div>

              </div>
        </div>}
          <img 
            src={pinDetail?.image?.asset?.url} 
            className='rounded-t-3xl rounded-b-lg w-full'
            alt='user-post'
          />

          
          {/* Render the edit button only for the user who created it. */}
          
          {isUserLoggedIn && pinUserId === user?._id && 
          <div 
            className='absolute top-2 right-2 z-1000  bg-white p-2 rounded-full cursor-pointer shadow-md'
            onClick={() => navigate(`/pin-edit/${pinId}`)}
            >
 
            <Link to={'/EditPin'}>
              <AiFillEdit color='grey'fontSize={21}/>
            </Link>
          </div> }
          

          {/* Render the delete button only for the user who created it. */}
          {isUserLoggedIn && pinUserId === user?._id && 
          <div 
            className='absolute top-2 left-2 z-1000 bg-white p-2 rounded-full cursor-pointer shadow-md'
            onClick={handleDelete}
            >
              <AiFillDelete color='red'fontSize={21}/>
            
          </div>}

    
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
              <div className='flex justify-between'>
                    {/* Render the title of the pin */}
                    <h1 className='text-4xl text-white font-bold break-words mt-3'>
                      {pinDetail?.title}
                    </h1>

                    {/* Render the save post button */}
                    {isUserLoggedIn && pinUserId !== user?._id && 
                        <div 
                          className='bg-white text-[#06A7F7] hover:bg-[#06A7F7] hover:text-white transition duration-500 font-bold p-2 rounded-full cursor-pointer outline-none'
                          onClick={handleSavePin}
                          >
                            <CiBookmarkPlus fontSize={35} />
                        </div>}
              </div>


            {/* Render the description of the pin */}
            <p className='mt-3 text-white'>
              {pinDetail?.about}
            </p>
          </div>
          

          {/* Render the details of the user who posted the pin */}
          <Link to={`/user-profile/${pinDetail?.postedBy?._id}`}  className="flex gap-2 mt-5 items-center bg-[#2A2C3E] text-white hover:text-[#06A7F7] rounded-lg">

            {/* The user's profile pic */}
            <img 
              className='w-8 h-8 rounded-full object-cover'
              src={pinDetail?.postedBy?.image}
              alt='user-profile'
            />

            {/* Ṭhe user's name */}
            <p className='font-semibold capitalize text-sm'>{pinDetail?.postedBy?.userName}</p>
          </Link>

          {/* For rendering the comment section */}
          <h2 className='mt-5 text-2xl text-white'>Comments</h2>
          <div className='max-h-370 overflow-y-auto'>

            {/* Ṛender comments from other users, if any */}
            {pinDetail?.comments?.map((item) => ( 
                  <div className="flex gap-2 mt-5 items-center bg-[#2A2C3E] rounded-lg" key={item?.comment}>
                    {/* Render Profile pic of the comment poster */}
                    <img
                      src={item?.postedBy?.image}
                      className="w-10 h-10 rounded-full"
                      alt="user-profile"
                    />

                    {/* Render the name of the poster who posted the comment, and their comment */}
                    <div className="flex flex-col">
                      <p className="font-bold text-white">{item?.postedBy?.userName}</p>
                      <p className='text-white'>{item?.comment}</p>
                    </div>
                  </div>
                ))}
          </div>

          {/* Renders the comment input field (The pic of the poster, input field, and the button for posting the comment) */}
          {isUserLoggedIn && <div className='flex flex-wrap mt-6 gap-3'>
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
            </div>}

        </div>
      </div>
      {/* {console.log(pins)} */}



      
      {
        // If there are pins with the same category as this one, render them below
        pins?.length > 0 ? (
          /* The "More like this" part below the detailed pin */
          <>
            {/* Overlay for when the user wants to delete their post. */}
            {goingToDelete && <div className='absolute z-1000 flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 h-full w-full bg-blackOverlay'>
                    
            </div>}

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