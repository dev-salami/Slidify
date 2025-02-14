/* eslint-disable @typescript-eslint/no-unused-vars */
export const getGeneratedImageUrl = async (randomNumber : number) => {

    const query = 'nature'; // Search query for images
    const imageList = await fetchImageList();
  
    if (imageList && imageList.length > 0) {
      const index = randomNumber % imageList.length; // Use random number as index
      const selectedImage = imageList[index];
      return selectedImage.urls.regular; // Reproducible image URL
    } else {
      console.error('No images found');
    }

}


const token = "fVYJxAu1NPVYx92XLLTyGA1ann1xnVkn3rVocvG2cxI"
const query = 'city';

const fetchImageList = async ( ) => {
    const accessKey = 'YOUR_ACCESS_KEY';
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${token}&orientation=squarish`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.results; // Array of images
    } catch (error) {
      console.error('Error fetching image list:', error);
    }
  };