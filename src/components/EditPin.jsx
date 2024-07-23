import React, { useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
// categories: [{name: 'sports', image: ''}]
import { categories, pinDetailQuery } from '../utils/data';

const EditPin = ({ user }) => {

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  // We use this hook in this particular code, to navigate to the feed page once the "save button" is clicked.
  const navigate = useNavigate();

  const { pinId } = useParams();

  useEffect((e) => {
    const query = pinDetailQuery(pinId);

    client.fetch(query)
      .then((data) => {
          setTitle(data[0].title);
          setAbout(data[0].about);
          setCategory(data[0].category);
          setImageAsset(data[0]?.image);
          // console.log(data[0])
        });
  }, [pinId])



  // Function for uploading the image, when the user clicks "Upload Button".
  const uploadImage = (e) => {

    // Extract the type and name of the uploaded file
    const {type, name} = e.target.files[0];

    // Check if the uploaded file is an image of any of the below types
    if (type === 'image/png' || 
        type === 'image/svg' || 
        type === 'image/jpeg' || 
        type === 'image/gif' || 
        type === 'image/tiff' || 
        type === 'image/webp') {
          setWrongImageType(false);
          setLoading(true);

          // The below code handles the upload part
          client.assets
            .upload('image', e.target.files[0], { contentType: type, filename: name })
            .then((document) => {
              // The image asset variable (The hook for rendering the image if already uploaded) is given the "document" value. Which in this case, is the image itself. and the additional information about it.
              setImageAsset(document);
              setLoading(false)
            })
            .catch((error) => {
              console.log('Image upload error ', error);
            })
    } else {
            setWrongImageType(true);
    }
  }

  // Function for submitting the pin to the Sanity database.
  const savePin = () => {

    // If all the fields are filled...
    if(title && about && destination && imageAsset && category) {
      // We use the data from the fields... 
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id
        },
        category: {
          _type: 'category',
          _ref: category
        },
        category,
      }

      // To create the pin and put it in the database...
      // client.create(doc)
      //   .then(() => {
      //     // And then we navigate back to home.
      //     navigate('/')
      //   })

      client
      .patch(pinId)
      .set(doc)
      .commit()
      .then(() => {
        // Successfully updated the background
        navigate('/');
      })
      .catch((error) => {
        // Handle error
        console.error('Error updating the post:', error);
      }); 
    } else {
      // If the user clicks the submit button, but the fields are empty, we set the "fields" state to true, which will trigger the "Please fill all the details in the form" message... 
      setFields(true);
      console.log(title)
      console.log(about)
      console.log(imageAsset)
      console.log(category)
      // For a duration of 2 seconds.
      setTimeout(() => setFields(false), 2000)
    }
  }

   // For resizing the description text box
   const autoResize = (e) => {
    e.target.style.height = 'auto'; 
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  return (

    // Renders two things: A message in case all the fields aren't filled when the submit button is clicked, and the whole "Create Pin" form.
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>

    {/* If the fields are empty, then the "Please fill in all the fields" message will show */}
    {fields && (
      <p className='text-red-500 mb-5 text-xl transistion-all duration-150 ease-in'>Please fill in all the fields</p>
    )}

    {/* For rendering the whole "Create Pin" form */}
    <div className='flex lg:flex-col flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full'>

      {/* Renders the left side of the "Create Pin" block (The "upload image" button) */}
      <div className='bg-secondaryColor p-3 flex flex-0.7 w-full'>
        <div className='flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420'>

          {/* Appears when the image is loading */}
          {loading && <Spinner />}

          {/* In case the user uploaded the image format which isn't supported by the code */}
          {wrongImageType && <p>Wrong image type</p>}

          {/* Logic for what to do if: The user hasn't uploaded the image, and has uploaded it  */}
          {!imageAsset ? (
            // If the user hasn't uploaded the image, then show the "Upload image" button
            <label>
              {/* Text informing the user about what they can upload, along with the upload icon */}
              <div className='flex flex-col items-center justify-center h-full'>
                <div className='flex flex-col justify-center items-center'>
                  <p className='font-bold text-2xl'>
                    <AiOutlineCloudUpload />
                  </p>
                  <p className='text-lg'>Click to upload</p>
                </div>
                <p className='mt-32 text-gray-400'>
                  Use high quality JPG, SVG, PNG, GIF less than 20 MB
                </p>
              </div>

              {/* The box where you click for uploading the image */}
              <input 
                type="file" 
                name="upload-image"
                onChange={uploadImage}
                className='w-0 h-0'
              />
            </label>
          ) : (
            // If the user has already uploaded the image, then display that image, and give them a button for deleting it
            <div className='relative h-full'>
              <img src={imageAsset} alt='uploaded-pic' className='h-full w-full object-cover' />
              <button
                type='button'
                className='absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                onClick={() => setImageAsset(null)}
              >
                <MdDelete />
              </button>
            </div>
          )}
        </div>

      </div>


      {/* Renders the right side of the "Create Pin" block (Title, about, category selection, etc...) */}
      <div className='flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full'>

        {/* For entering the title of the post */}
          <input 
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Add your title here'
            className='outline-none text-xl font-bold border-b-2 border-gray-200 p-2'
          />

            {/* Renders the image of the user, if they exist */}
          {user && (
            // Renders the image of the user
            <div
            className='flex gap-2 my-2 items-center bg-white rounded-lg'
            >
              <img 
                src={user.image}
                className="w-10 h-10 rounded-full"
                alt='user-profile'
              />
              <p className='font-bold'>{user.userName}</p>
            </div>
          )}

          {/* For entering the description of the post */}
          <textarea 
            type='text'
            // rows={48}
            value={about}
            onChange={(e) =>{
                              setAbout(e.target.value); 
                              autoResize(e);
                            } 
                      }
            placeholder='What is your pin about'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
            
            
          />
            {/* e.target.textlength and e.target.cols 
                (e) => e.target.textlength%112 === 0 ? e.target.rows++ : 1
            */}
            {/* For pasting the link of the image you are going to post (Remove this feature)  */}
          {/* <input 
            type='text'
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder='Add a destination link'
            className='outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2'
          /> */}

            {/* Renders the "Choose Pin Category option", and the "Save Pin" button */}
          <div className='flex flex-col'>
            {/* Renders the category option */}
            <div>
              <p className='mb-2 font-semibold text-lg sm:text-xl'>Choose Pin Category</p>

              {/* For creating the select category options menu */}
              <select
                onChange={(e) => setCategory(e.target.value)}
                className='outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer'
              >

                {/* For creating an options menu of which category the user wants to post their pin in  */}
                <option value="other" className='bg-white' >Select Category</option>

                {/* Renders the available categories in the options menu  */}
                {categories.map((category) => (
                  <option 
                    className='text-base border-0 outline-none capitalize bg-white text-black'
                    key={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Renders the "Save Pin" button */}
            <div className='flex justify-end items-end mt-5'>
                  <button
                    type='button'
                    onClick={savePin}
                    className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
                  >
                    Save Pin
                  </button>
            </div>
          </div>
      </div>
    </div>
    </div>
  )
}
export default EditPin