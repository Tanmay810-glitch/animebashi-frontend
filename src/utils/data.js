export const categories = [
    {
      name: 'anime banashi',
      image: 'https://staticg.sportskeeda.com/editor/2021/12/ed547-16408681947929-1920.jpg?w=640',
    },
    {
      name: 'manhwa banashi',
      image: 'https://c4.wallpaperflare.com/wallpaper/983/463/791/solo-leveling-red-eyes-smiling-evil-hd-wallpaper-preview.jpg',
    },
    {
      name: 'manga banashi',
      image: 'https://sm.ign.com/ign_in/comics/default/kagurabachi-manga_hm33.jpg',
    },
    {
      name: 'writing analysis',
      image: 'https://www.nicepng.com/png/detail/123-1235180_anime-reaction-images-thinking-anime-png.png',
    },
    {
      name: 'sakuga breakdown',
      image: 'https://blog.sakugabooru.com/wp-content/uploads/2017/05/heroaca11-1024x576.jpg',
    },
    {
      name: 'fanart banashi',
      image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/58d98e0a-ad4c-4427-b989-e3c6ee5ce09c/dfdkjzv-68584325-9617-48c7-a90b-58565154b4ae.jpg/v1/fill/w_797,h_1002,q_70,strp/aoyama_nanami_2__referenced___completed__by_tokyoghoul2343_dfdkjzv-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTYwOSIsInBhdGgiOiJcL2ZcLzU4ZDk4ZTBhLWFkNGMtNDQyNy1iOTg5LWUzYzZlZTVjZTA5Y1wvZGZka2p6di02ODU4NDMyNS05NjE3LTQ4YzctYTkwYi01ODU2NTE1NGI0YWUuanBnIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.iXS68MchOcnjtwy5YNrcOHiyqAFcFt2ORM5kAtKEtT8',
    },
    {
      name: 'cosplay banashi',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnLaqmUb6ewdhqs7QCWe5tQ9x6mURLBO49GA&s',
    },
    {
      name: 'anime announcement',
      image: 'https://sportshub.cbsistatic.com/i/2024/05/27/42d930b8-68bf-454e-8b0f-9dacba0d2b04/sakamoto-days.jpg?auto=webp&width=1052&height=1486&crop=0.708:1,smart',
    },
    {
      name: 'light novel banashi',
      image: 'https://m.media-amazon.com/images/I/51PBFeveUtL.jpg',
    }, {
      name: 'VA banashi',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJcQyvB5K9nYfPg8u2TrbQ8kroOWoGu8tYLQ&s',
    },
    {
      name: 'studio banashi',
      image: 'https://www.pa-works.jp/images/common/ph_300x300.jpg',
    }, {
      name: 'culture banashi',
      image: 'https://d3mvlb3hz2g78.cloudfront.net/wp-content/uploads/2011/03/thumb_720_450_cherry-blossoms_shutterstock_62627689.jpg',
    }, 
    {
      name: 'other',
      image: 'https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg',
    },
  ];
  
  // For fetching the pins for the feed (Used on the Feed page)
  export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
        _id,
        destination,
        title,
        about,
        postedBy->{
          _id,
          userName,
          image
        },
        save[]{
          _key,
          postedBy->{
            _id,
            userName,
            image
          },
        },
      } `;
  
 // For rendering the details of the pin (Used on the PinDetail page)
  export const pinDetailQuery = (pinId) => {
    const query = `*[_type == "pin" && _id == '${pinId}']{
      image{
        asset->{
          url
        }
      },
      _id,
      title, 
      about,
      category,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
     save[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
      comments[]{
        comment,
        _key,
        postedBy->{
          _id,
          userName,
          image
        },
      }
    }`;
    return query;
  };
  
  // For fetching related pins
  export const pinDetailMorePinQuery = (pin) => {
    const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
      image{
        asset->{
          url
        }
      },
      _id,
      destination,
      title,
      about,
      postedBy->{
        _id,
        userName,
        image,
      },
      save[]{
        _key,
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`;
    return query;
  };

  // For fetching search results
  export const searchQuery = (searchTerm) => {
    const query = `*[_type == "pin" && title match '${searchTerm}*' || _type == "pin" && category match '${searchTerm}*' || _type == "pin" && about match '${searchTerm}*']{
      image{
        asset->{
          url
        }
      },
          _id,
          title,
          about,
          postedBy->{
            _id,
            userName,
            image
          },
          save[]{
            _key,
            postedBy->{
              _id,
              userName,
              image
            },
          },
        } `;
    return query;
  };

  // For fetching default carousel images, unrelated to any specfic category
  export const defaultCarouselImagesQuery =  `*[_type == "carousel_images"] {
      image{
        asset->{
          url
        }
      },
      category,
    }`;

  
  // For fetching carousel images related to a specific category
  export const carouselImagesQuery = (categoryId) => {
        const query = `*[_type == "carousel_images" && category match '${categoryId}*']{
          image{
            asset->{
              url
            }
          },
          category,
        }`;
    return query;
  };

  // For verifying the user
  export const userQuery = (userId) => {
    const query = `*[_type == "user" && _id == '${userId}']`;
    return query;
  };
  
  // For fetching the pins created by the user
  export const userCreatedPinsQuery = (userId) => {
    const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
      image{
        asset->{
          url
        }
      },
      _id,
      title,
      about,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`;
    return query;
  };
  
  // For fetching the pins saved by the user 
  export const userSavedPinsQuery = (userId) => {
    const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
      image{
        asset->{
          url
        }
      },
      _id,
      title,
      about,
      destination,
      postedBy->{
        _id,
        userName,
        image
      },
      save[]{
        postedBy->{
          _id,
          userName,
          image
        },
      },
    }`;
    return query;
  };

  // For fetching the user background for the respective user
    export const userBgQuery = (userId) => {
      const query = `*[_type == "user_background" && userId == '${userId}'] {
        userId,
        _id,
        image{
          asset->{
            url,
          }
        }
      }`;
      return query;
    };