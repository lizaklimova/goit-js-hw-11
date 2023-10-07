import axios from 'axios';

axios.defaults.headers.common['x-api-key'] =
  '39899742-de5fd769b68a5bc4e589c2cf0';
axios.defaults.baseURL = 'https://pixabay.com';

export async function getImages(value) {
  try {
    const resp = await axios.get('/api', {
      params: {
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    console.log(resp);
  } catch (error) {
    console.log(error.message);
  }
}
