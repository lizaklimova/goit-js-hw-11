import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImages(value, page = 1) {
  const response = await axios.get('', {
    params: {
      key: '39899742-de5fd769b68a5bc4e589c2cf0',
      q: value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 40,
    },
  });

  const data = response.data;

  return data;
}
