import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { userBgQuery } from '../utils/data';

import { client } from '../client';
import Spinner from './Spinner';
// categories: [{name: 'sports', image: ''}]
import { categories } from '../utils/data';

const EditBg = ({ user }) => {

  // For displaying the loader. It will be displayed when the value of loading is set to true.
  const [loading, setLoading] = useState(false);

   // If the save button is clicked but the image is not uploaded, the fields hook value will be set to true, and a warning telling the user to fill all the fields will appear 
  const [fields, setFields] = useState(false);

  // Will hold the image the user wants to upload
  const [imageAsset, setImageAsset] = useState(null);

  // If the image the user uploaded doesn't match any of the specified image types, a warning telling the user that the uploaded image format is invalid, will appear.
  const [wrongImageType, setWrongImageType] = useState(false);

  // We use this hook in this particular code, to navigate to the feed page once the "save button" is clicked.
  const navigate = useNavigate();

  // Function for uploading the image, when the user clicks "Upload Button", for displaying it back to the user.
  const uploadBg = (e) => {

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
  const saveBg = () => {

    /*
      Algorithm for ensuring that there is only one bg in the database for each user:

      1. Check if the user has uploaded the pic
      2. If the user has uploaded the pic, create the doc to be submitted to the database
      3. Use the user_bg query for fetching the bg wallpaper of the user.
      4. If the user_bg query returns something, it means that a bg already exists. In which case, 
         we need to replace it.
      5. If the user_bg query returns nothing, it means that there is no bg for the user in the db. In which case, we submit it normally. 
    */


    // When the user submits the image...
    if( imageAsset?._id) {
      // We create it into a doc... 

      /*
        DONE: Fix the user._id error. It says the _id attribute can't be found.

        SOLUTION: The problem was that the user prop was not being passed to this element. Fixed that
        by moving this element from App.js to Home.jsx, and then added the existing user prop to it.
      */

      // DONE: Ensure that there is only one user bg in the database
      const doc = {
        _type: 'user_background',
        userId: user._id,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id
          }
        }
      }

      // Now, we want each user to only have one background.
      // So for that, we first fetch the user's bg if it already exists
      const doesBgExist = userBgQuery(user._id);

      // We process the query (If you don't process it, it'll just be a plain string)
      client.fetch(doesBgExist)
      .then((data) => {
        console.log(data[0]._id);

        // Then we check if the user bg exists 
        if(data[0]?._id) {
          // If it has an id, then that means it exists.
          // In which case, we replace it with the new bg
          client
          .patch(data[0]._id)
          .set(doc)
          .commit()
          .then(() => {
            // Successfully updated the background so we head back to the home page
            navigate('/');
          })
          .catch((error) => {
            // Handle error in case it isn't successfully updated
            console.error('Error updating background:', error);
          });  
        } else {
          // If we are in this block, then that means the user_bg for this user doesn't exist. In which case, we simply do it the normal way...
          client.create(doc)
          .then(() => {
            // And then we navigate back to home.
            navigate('/')
          })
        }
      })

  
    } else {
      // If the user clicks the submit button, but the fields are empty, we set the "fields" state to true, which will trigger the "Please fill all the details in the form" message... 

      // (Though here it isn't actually needed because the save button will only appear once the user has uploaded the image (along with the delete button for the option of deleting it to set a new one))

      setFields(true);

      // For a duration of 2 seconds.
      setTimeout(() => setFields(false), 2000)
    }
  }

  return (

    // Renders two things: A message in case all the fields aren't filled when the submit button is clicked, and the box for uploading the image.
    <div className='flex flex-col justify-center items-center mt-5 lg:h-4/5'>

      {/* CreatePin: If the fields are empty when clicking the "save pin" button, then the "Please fill in all the fields" message will show */}

      {/* EditPin: Here in the edit mode, the fields will always already be filled. But still needs to be in use. */}
      {fields && (
        <p className='text-red-500 mb-5 text-xl transistion-all duration-150 ease-in'>Please fill in all the fields</p>
      )}

      {/* For rendering the whole "Edit BG form */}
      <div className='flex flex-col justify-center items-center bg-[#2A2C3E] lg:p-5 p-3 rounded-lg w-full'>
        <h1 className='text-xl text-white font-bold'>Upload your background:</h1>
        <br />
        {/* Renders the "upload image" button */}
        <div className='bg-[#393c54] p-3 flex flex-0.7 w-full'>
          <div className='flex justify-center items-center flex-col border-2 border-dotted rounded-lg  border-gray-300 p-3 w-full h-420'>

            {/* Appears when the image is loading */}
            {loading && <Spinner />}

            {/* In case the user uploaded the image format which isn't supported by the code */}
            {wrongImageType && <p className='text-white'>Wrong image type</p>}

            {/* Logic for what to do if: The user hasn't uploaded the image, and has uploaded it  */}
            {!imageAsset ? (
              // If the user hasn't uploaded the image, then show the "Upload image" button
              <label>
                {/* Text informing the user about what they can upload, along with the upload icon */}
                <div className='flex flex-col items-center justify-center h-full'>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='font-bold text-2xl'>
                      <AiOutlineCloudUpload className='text-white'/>
                    </p>
                    <p className='text-lg text-white'>Click to upload</p>
                  </div>
                  <p className='mt-32 text-gray-400'>
                    Use high quality JPG, SVG, PNG, GIF less than 20 MB
                  </p>
                </div>

                {/* The box where you click for uploading the image */}
                <input 
                  type="file" 
                  name="upload-image"
                  onChange={uploadBg}
                  className='w-0 h-0'
                />
              </label>
            ) : (
              // If the user has already uploaded the image, then display that image, and give them buttons for saving and deleting it
              <div className='relative h-full'>
                <img src={imageAsset?.url} alt='uploaded-pic' className='h-full w-full object-cover' />
               {/* Renders the "Save BG" and "Delete BG" button */}
                <div className='flex flex-row justify-center items-end mt-10'>
                    <button
                      type='button'
                      className='mr-5 p-2 pr-5 pl-5 rounded-full bg-secondaryColor cursor-pointer outline-none hover:shadow-lg transition-all duration-500 ease-in-out'
                      onClick={() => setImageAsset(null)}
                    >
                      Delete
                    </button>

                    <button
                      type='button'
                      onClick={saveBg}
                      className='bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none'
                    >
                      Save Bg
                    </button>


                </div>    
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
export default EditBg