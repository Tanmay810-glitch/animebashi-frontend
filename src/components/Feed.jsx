import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { client  } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner'
import { feedQuery, searchQuery } from '../utils/data';
import Carousel from './Carousel';
const Feed = () => {

  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();


  // useEffect is a React hook that runs a function after a component is mounted or updated.
  // We use it here to fetch the pins from Sanity.
  useEffect(() => {
    setLoading(true);

    // The below logic checks if the user is currently on a category page.
    if(categoryId) {
      //If they are, we feed the categoryId to the searchQuery, and it will bring them pins related to
      //that specific category.
      const query = searchQuery(categoryId);

      client.fetch(query)
        .then((data) => {
          setPins(data);
          console.log(data);
          setLoading(false);
        })
    } else {
      //If they are not, we feed the feedQuery, and it will bring them all the available pins from the database.
      client.fetch(feedQuery)
        .then((data) => {
          setPins(data);
          setLoading(false);
        })
    }
  }, [categoryId])

  if(loading) return <Spinner message="We are adding new ideas to your feed!" />

  if(!pins?.length) return <h2 className='text-white'>No pins available</h2>

  return (
    <div>
      
      <div className='bg-[#393c54] mt-2 mb-2'>
        <Carousel/>
      </div>

      <h1 className='text-3xl text-white font-bold mt-8 ml-3'>What people are talking about!</h1> 
      {pins && <MasonryLayout pins={pins} />}
    </div>
  )
}

export default Feed