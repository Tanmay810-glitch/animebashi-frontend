import React, { useEffect, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate, useParams } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
// categories: [{name: 'sports', image: ''}]
import { categories, pinDetailQuery } from '../utils/data';

const EditPin = ({ user }) => {

  // Will hold the title of the post
  const [title, setTitle] = useState('');

  // Will hold the description of the post
  const [about, setAbout] = useState('');

  
  // const [textareaHeight, setTextareaHeight] = useState(1);
  // const [destination, setDestination] = useState('');

  // For displaying the loader. It will be displayed when the value of loading is set to true.
  const [loading, setLoading] = useState(false);

  // If the submit button is clicked but one or more fields of the form are empty, the fields hook value will be set to true, and a warning telling the user to fill all the fields will appear 
  const [fields, setFields] = useState(false);

  // Will hold the category of the post
  const [category, setCategory] = useState(null);

  // Will hold the image the user wants to upload
  const [imageAsset, setImageAsset] = useState(null);

  // If the image the user uploaded doesn't match any of the specified image types, a warning telling the user that the uploaded image format is invalid, will appear.  
  const [wrongImageType, setWrongImageType] = useState(false);

  // This will help in displaying the image after the user clicks on the edit button and views the current state of post before editing it
  const [justClickedEdit, setJustClickedEdit] = useState(false);

  // We use this hook in this particular code, to navigate to the feed page once the "save button" is clicked.
  const navigate = useNavigate();

  // The ID of the pin you'll want to edit, will be visible in the url bar. We grab that ID from there.
  const { pinId } = useParams();

  // On page load...
  useEffect((e) => {
    // We send a query to grab the details of the pin...
    const query = pinDetailQuery(pinId);

    setJustClickedEdit(true)

    // Once we get the results of the query, we process it...
    client.fetch(query)
      .then((data) => {
          // And then set the respective fields to those details
          setTitle(data[0].title);
          setAbout(data[0].about);
          setCategory(data[0].category);
          setImageAsset(data[0]?.image?.asset?.url);
          console.log(data[0]?.image)
        });


  }, [pinId])



  // Function for uploading the image, when the user clicks "Upload Button".
  const uploadImage = (e) => {

    // This will allow us to get the user uploaded image to appear as preview
    setJustClickedEdit(false);

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

  // Function for submitting the edited pin to the Sanity database.
  const savePin = () => {

    // If all the fields are filled...
    if(title && about && imageAsset && category) {
      // We use the data from the fields... 
      const doc = {
        _type: 'pin',
        title,
        about,
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

      // Patch - Find the document to be edited with the help of it's ID
      // Set - set the value of the document to the updated values
      // Commit - Save the changes 
      client
      .patch(pinId)
      .set(doc)
      .commit()
      .then(() => {
        // Successfully updated the post
        console.log("This is what is in the imageAsset", imageAsset)
        navigate('/');
      })
      .catch((error) => {
        // Handle error
        console.error('Error updating the post:', error);
      }); 
    } else {
      // If the user clicks the submit button, but the fields are empty, we set the "fields" state to true, which will trigger the "Please fill all the details in the form" message... 
      setFields(true);
      // console.log(title)
      // console.log(about)
      // console.log(imageAsset)
      // console.log(category)

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
    <div className='flex lg:flex-col flex-col rounded-lg justify-center items-center bg-[#2A2C3E]  lg:p-5 p-3 w-full'>

      {/* Renders the left side of the "Create Pin" block (The "upload image" button) */}
      <div className='bg-[#393c54] p-3 flex flex-0.7 rounded-lg w-full'>
        <div className='flex justify-center items-center flex-col border-2 border-dotted rounded-lg border-gray-300 p-3 w-full h-420'>

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
              {/* 
                The working of the 'src' mechanism.

                The initial value of imageAsset after coming on the edit post after clicking the edit button, will directly be the url. So for that, typing imageAsset.url doesn't have any
                meaning.
                
                But after the user uploads an image, the value of the imageAsset will be an object,
                which will have a 'url' property.

                The justClickedEdit hook will work as a flag. If the user came after clicking the edit button, the "flag" will be set to true, the value of src will directly be the value of imageAsset, and the image will be properly displayed. 
                
                After the user clicks "upload button", the "flag" will be set to false, and after that, when the user uploads the pic, the value of 'src' will be 'imageAsset.url' 
              */}
              <img src={ justClickedEdit ? imageAsset : imageAsset.url} alt='uploaded-pic' className='h-full w-full object-cover' />
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
            className='outline-none bg-[#393c54] rounded-md text-white text-xl font-bold border-b-2 border-gray-200 focus:border-[#06A7F7] transition duration-500 p-2'
          />

            {/* Renders the image of the user, if they exist */}
          {user && (
            // Renders the image of the user
            <div
            className='flex gap-2 my-2 items-center bg-[#2A2C3E] text-white rounded-lg'
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
            className='outline-none text-base sm:text-lg bg-[#393c54] text-white rounded-md border-b-2 border-gray-200 transition duration-500 focus:border-[#06A7F7] p-2'
            
            
          />
            {/* e.target.textlength and e.target.cols 
                (e) => e.target.textlength%112 === 0 ? e.target.rows++ : 1
            */}
            {/* For pasting the link of the image you are going to post (Deprecated: Remove this feature)  */}
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
              <p className='mb-2 font-semibold text-lg text-white sm:text-xl'>Choose Pin Category</p>

              {/* For creating the select category options menu */}
              <select
                onChange={(e) => setCategory(e.target.value)}
                className='outline-none bg-[#393c54] w-4/5 text-white text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer transition duration-500 focus:border-[#06A7F7]'
              >

                {/* For creating an options menu of which category the user wants to post their pin in  */}
                <option value="other" className='bg-white' >Select Category</option>

                {/* Renders the available categories in the options menu  */}
                {categories.map((category) => (
                  <option 
                    className='text-base border-0 outline-none capitalize bg-[#393c54] text-white'
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
                    className='bg-white text-[#06A7F7] hover:bg-[#06A7F7] hover:text-white transition duration-500 font-bold p-2 rounded-full w-28 outline-none'
                  >
                    Save
                  </button>
            </div>
          </div>
      </div>
    </div>
    </div>
  )
}
export default EditPin