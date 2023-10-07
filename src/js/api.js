import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export async function getImages(value, page = 1) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
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

    const images = response.data.hits;

    if (!images.length) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    return images;
  } catch (error) {
    console.log(error.message);
  }
}
