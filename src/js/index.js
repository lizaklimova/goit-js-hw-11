import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import { formRef } from './refs';
import { getImages } from './api';

formRef.addEventListener('submit', onSubmitHandler);

function onSubmitHandler(event) {
  event.preventDefault();

  const input = event.currentTarget.elements.searchQuery;
  const inputValue = input.value.trim();

  getImages(inputValue);

  event.currentTarget.reset();
}
