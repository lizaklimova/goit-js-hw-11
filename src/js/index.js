import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import { formRef, galleryRef, loadMoreRef } from './refs';
import { getImages } from './api';

let page;
let inputValue = null;

formRef.addEventListener('submit', onSubmitHandler);
loadMoreRef.addEventListener('click', onLoadMore);

function onSubmitHandler(event) {
  page = 1;
  event.preventDefault();

  const input = event.currentTarget.elements.searchQuery;
  inputValue = input.value.trim();

  getImages(inputValue)
    .then(resp => {
      insertMarkup(galleryRef, createMarkup(resp));
      removeElClass('is-hidden');
    })
    .catch(err => console.log(err));

  event.currentTarget.reset();
}

function onLoadMore(event) {
  page += 1;

  event.target.disabled = true;

  getImages(inputValue, page)
    .then(resp => {
      insertMarkup(galleryRef, createMarkup(resp));
      console.log(resp);
    })
    .catch(err => console.log(err));
}

function createMarkup(pics) {
  const markup = pics
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${likes}</b>
    </p>
    <p class="info-item">
      <b>${views}</b>
    </p>
    <p class="info-item">
      <b>${comments}</b>
    </p>
    <p class="info-item">
      <b>${downloads}</b>
    </p>
  </div>
</div>
    `;
      }
    )
    .join('');
  return markup;
}

function insertMarkup(container, markup) {
  container.insertAdjacentHTML('beforeend', markup);
}

function removeElClass(cl1) {
  onLoadMore.classList.remove(cl1);
}
