import axios from 'axios';
const ip = '10.6.27.137';
const port = '9000'

/************************************ URLS ************************************/
const postCroppedImageURL = `http://${ip}:${port}/api/item/croppedImage`;
const getClarifaiTokenURL = `http://${ip}:${port}/api/auth/clarifaiToken`;
const postImageToClarifaiURL = `https://api.clarifai.com/v1/tag/`;

/************************************ PHOTOS ************************************/

const postCroppedImage = (image) => {
	return axios.post(postCroppedImageURL, { image })
	  .then(function (response) {
	    console.log('Response from postCroppedImage:', response);
	  })
	  .catch(function (error) {
	    console.log('Error from postCroppedImage:', error);
	  });
}

const getClarifaiToken = () => {
	return axios.get(getClarifaiTokenURL)
  		.then( response => console.log(response) || response.data.token )
  		.catch( error => console.log('Error getClarifaiToken', error) );
}


const postImageToClarifai = (base64Image, token) => {
	return axios(postImageToClarifaiURL, {
		  method: 'post',
		  model: 'general-v1.3',
		  headers: {
		    'Authorization': `Bearer ${token}`
		  },
		  data: {
		  	'encoded_data': image
		  }
		})
	  .then(function (response) {
	    console.log(response, 'response from inside utils');
	  })
	  .catch(function (error) {
	    console.log('Error postImageToClarifai:', error);
	  });
}




/************************************ EXPORT ************************************/

export default { postCroppedImage, getClarifaiToken, postImageToClarifai }