// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// import Carousel_Image from '../assets/Carousel_Image.jpg';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { carouselImagesQuery, defaultCarouselImagesQuery } from '../utils/data';
import { client } from '../client';
import Spinner from './Spinner';
// register Swiper custom elements. Allows you to use swiper globally.
register();

const Carousel = () => {

  // The loading is for displaying the loader. It will be displayed when the value of loading is set to true.
  const [loading, setLoading] = useState(false);

  // The images for the carousel that we'll be fetching from the database, will be stored in carouselImages
  const [carouselImages, setCarouselImages] = useState(null);

  // The category ID will be displayed in the url whenever you go to a specific category from the sidebar. The categoryId will store the ID.
  const { categoryId } = useParams();

  // The slidesPerView will hold the value for the "slides-per-view" attribute in the swiper-container element. It's default value will be 1 for mobile devices, and 2 for devices a bit larger than that.
  const [slidesPerView, setSlidesPerView] = useState(window.innerWidth <= 768 ? 1 : 2);

  /* 
    useEffect is a React hook that runs a function after a component is mounted or updated (In oversimplified 
    terms, useEffects has instructions on what to do when the page it is in, loads).
  */

  // Below is a mechanism for adjusting the number of slides on the screen as per the size of the device
  useEffect(() => {
      function handleResize() {
        // The first one is for a mobile and the last one is for ultra wide screens
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
  
      // Adds an event listener which calls the handleResize function every time the size of the window changes
      window.addEventListener('resize', handleResize);
  
      // Removes the event listener when the is removed component (unmounted) as well 
      return () => {
        window.removeEventListener('resize', handleResize);
      };
  }, []);



  // On page load, we fetch the carousel images from Sanity. The fetched images are then stored in carouselImages.
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
          setLoading(false);
        })

      /*
        Here's what's in the data and also the value of carouselImages will be this:

        [0, 1, 2, 3...]

        0: 
          category:
          image:
            asset:
              url:
      */ 

        
    } else {
      //If they are not, we feed the defaultCarouselImagesQuery, and it will bring them all the available carouselImages from the database.

      client.fetch(defaultCarouselImagesQuery)
        .then((data) => {
          setCarouselImages(data);
          setLoading(false);
        })

      /*
        Here's what's in the data and also the value of carouselImages will be this:

        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9...]

        0: 
          category:
          image:
            asset:
              url:
      */ 
    }
  }, [categoryId])

  // If the value of loading is set to true, we bring in the loader tell the user that the content is being loaded
  if(loading) return <Spinner message="We are adding new banners to your feed!" />

  // If the length of the array of carouselImages is 0, it means that were no carousel images in the database to begin with. And it will show the message saying the same.
  if(!carouselImages?.length) return <h2>No carouselImages available</h2>

  

    
  return (
        <>  
            {/* The main title */}
            <h1 className='text-3xl text-white font-bold my-4 ml-3'>Anime & Manga News fresh out of the oven!</h1>

            {/* 
                The container of the slides, it has the following settings:
                (slides-per-view) How many slides can be viewed at once on the screen? (Handled by the handleResize function)
                (speed) At what speed the slides should go by? 1.5 seconds
                (autoplay) Does it play on its own or will the user have to drag it like a slider to view the images? It will play on its own
                (pagination)  Does it need an indicator which shows how many slides there are in the carousel and what slide you are curently on with the help of dots? No.
                (loop) Once its done shows all the slides, does it need to go back to the start and do it all again? Well, if the images in the carousel are more than 3 then yes, or else no.
                (css-mode) Do you want the slides to automatically center themselves on the screen when dragged manually, or do you just want to leave them where they are? Automatically center themselves.
                
                Note regarding css-mode: Setting it to true enables the modern css scroll snap api. For demo on how it works, go here: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap
            */}
            <swiper-container slides-per-view={slidesPerView} speed="150" autoplay="true" pagination="false"
            loop={`${carouselImages?.length > 3 ? "true" : "false"}`} css-mode="true">
              {/* 
                  We take each element in the carouselImages array we just got, and put each of them in a slide element.
                  We use the index of each element in the carouselImages array as a key for the slide element. 
                  The slide will also be linked to the category it belongs in. Clicking on it will lead you to that category.
                  Inside the slide element, we put in the image.
               */}
              {carouselImages?.map((data, index) => <swiper-slide key={index}><Link to={`/category/${data.category}`}><img className='rounded-xl pl-2' src={`${data?.image?.asset?.url}`} alt="" /></Link></swiper-slide>)}
            </swiper-container>

            
        </>



  )
}

export default Carousel