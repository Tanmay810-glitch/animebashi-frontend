// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// import Carousel_Image from '../assets/Carousel_Image.jpg';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { carouselImagesQuery, defaultCarouselImagesQuery } from '../utils/data';
import { client } from '../client';
import Spinner from './Spinner';
// register Swiper custom elements
register();

const Carousel = () => {

  const [loading, setLoading] = useState(false);
  const [carouselImages, setCarouselImages] = useState(null);
  const { categoryId } = useParams();
  const [slidesPerView, setSlidesPerView] = useState(window.innerWidth <= 768 ? 1 : 2);
  
  useEffect(() => {
      function handleResize() {
        if(window.innerWidth < 768) {
          setSlidesPerView(1);
        } else if (window.innerWidth > 768 && window.innerWidth < 1800) {
          setSlidesPerView(2);
        } else if (window.innerWidth >= 1800 &&  window.innerWidth < 2530) {
          setSlidesPerView(3);
        } else if (window.innerWidth >= 2530 && window.innerWidth <3300) {
          setSlidesPerView(4);
        } else {
          setSlidesPerView(5)
        }
      }
  
      // Add event listener for window resize
      window.addEventListener('resize', handleResize);
  
      // Clean up the event listener when component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
      };
  }, []);


  // useEffect is a React hook that runs a function after a component is mounted or updated.
  // We use it here to fetch the carousel images from Sanity.
  useEffect(() => {
    setLoading(true);

    // The below logic checks if the user is currently on a category page.
    if(categoryId) {
      //If they are, we feed the categoryId to the searchQuery, and it will bring them carouselImages related to
      //that specific category.

      //DONE: Write a query for fetching carouselImages related to a specific category.
      const query = carouselImagesQuery(categoryId);

      client.fetch(query)
        .then((data) => {
          setCarouselImages(data);
          // console.log(data);
          setLoading(false);
        })

        
    } else {
      //If they are not, we feed the feedQuery, and it will bring them all the available carouselImages from the database.

      client.fetch(defaultCarouselImagesQuery)
        .then((data) => {
          setCarouselImages(data);
          // console.log(data);
          setLoading(false);
        })
    }
  }, [categoryId])

  if(loading) return <Spinner message="We are adding new banners to your feed!" />

  if(!carouselImages?.length) return <h2>No carouselImages available</h2>

  

    
  return (
        <>
            <h1 className='text-3xl text-white font-bold my-4 ml-3'>Anime & Manga News fresh out of the oven!</h1>
            <swiper-container slides-per-view={slidesPerView} speed="150" autoplay="true" pagination="false"
            loop={`${carouselImages?.length > 3 ? "true" : "false"}`} css-mode="true">
              {/* {pins?.map((pin) => <Pin key={pin._id} pin={pin} className="w-max" />)} */}
              {carouselImages?.map((data, index) => <swiper-slide key={index}><Link to={`/category/${data.category}`}><img className='rounded-xl pl-2' src={`${data?.image?.asset?.url}`} alt="" /></Link></swiper-slide>)}
            </swiper-container>

            
        </>



  )
}

export default Carousel