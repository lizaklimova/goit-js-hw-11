import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import { formRef, galleryRef, loadMoreRef, searchBtn } from './refs';
import { getImages } from './api';

import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

addClass(loadMoreRef, 'is-hidden');

let page;
let perPage = 40;
let inputValue = null;

formRef.addEventListener('submit', onSubmitHandler);
loadMoreRef.addEventListener('click', onLoadMore);

function onSubmitHandler(event) {
  event.preventDefault();

  resetMarkup(galleryRef);

  page = 1;

  const input = event.currentTarget.elements.searchQuery;
  inputValue = input.value.trim().toLowerCase();

  if (inputValue === '') {
    Notify.warning('Enter valid search query!');
    return;
  }

  getImages(inputValue)
    .then(resp => {
      disableElement(searchBtn, true);
      lightbox.refresh();
      insertMarkup(galleryRef, createMarkup(resp.hits));
      removeClass(loadMoreRef, 'is-hidden');

      if (page === 1) {
        Notify.success(`Hooray! We found ${resp.totalHits} images.`);
      }

      if (galleryRef.childElementCount > resp.totalHits) {
        addClass(loadMoreRef, 'is-hidden');
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }

      if (galleryRef.childElementCount < perPage) {
        addClass(loadMoreRef, 'is-hidden');
      }
    })
    .catch(err => console.log(err))
    .finally(() => {
      disableElement(searchBtn, false);
    });

  event.currentTarget.reset();
}

function onLoadMore(event) {
  page += 1;

  disableElement(event.target, true);

  getImages(inputValue, page)
    .then(resp => {
      insertMarkup(galleryRef, createMarkup(resp.hits));
    })
    .catch(err => console.log(err))
    .finally(() => disableElement(event.target, false));
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
    <a href="${largeImageURL}">
       <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>
    `;
      }
    )
    .join('');

  lightbox.refresh();
  return markup;
}

function insertMarkup(container, markup) {
  container.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup(el) {
  el.innerHTML = '';
}

function removeClass(el, cl) {
  el.classList.remove(cl);
}

function addClass(el, cl) {
  el.classList.add(cl);
}

function disableElement(el, value) {
  el.disabled = value;
}
