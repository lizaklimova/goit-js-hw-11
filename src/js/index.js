import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import throttle from 'lodash.throttle';
import { formRef, galleryRef, loadMoreRef, searchBtn, loaderRef } from './refs';
import { getImages } from './api';
import {
  createMarkup,
  createMarkupString,
  resetMarkup,
  insertMarkup,
} from './markup';

import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

// addClass(loadMoreRef, 'is-hidden');
removeClass(loaderRef, 'loader');

let page;
let perPage = 40;
let inputValue = null;
let totalPages;

formRef.addEventListener('submit', onSubmitHandler);
// loadMoreRef.addEventListener('click', onLoadMore);
document.addEventListener('scroll', throttle(infiniteScrollHandler, 500));

function onSubmitHandler(event) {
  event.preventDefault();

  disableElement(searchBtn, true);
  resetMarkup(galleryRef);
  // addClass(loadMoreRef, 'is-hidden');

  page = 1;

  const input = event.currentTarget.elements.searchQuery;
  inputValue = input.value.trim().toLowerCase();

  getImages(inputValue, page)
    .then(resp => {
      if (!resp.hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (!inputValue) {
        Notify.warning('Please, enter valid query!');
        return;
      } else {
        if (resp.hits.length && inputValue) {
          Notify.info(`Hooray! We found ${resp.totalHits} images.`);
        }

        insertMarkup(galleryRef, createMarkup(resp.hits));
        lightbox.refresh();

        // removeClass(loadMoreRef, 'is-hidden');

        checkPagesLeft(resp);

        createSmoothScroll();
      }
    })
    .catch(err => console.log(err))
    .finally(() => {
      disableElement(searchBtn, false);
    });

  event.currentTarget.reset();
}

function onLoadMore() {
  getImages(inputValue, page)
    .then(resp => {
      createMarkup(resp.hits);
      insertMarkup(galleryRef, createMarkup(resp.hits));
      checkPagesLeft(resp);
    })
    .catch(err => console.log(err))
    .finally(() => {});
}

function checkPagesLeft(response) {
  totalPages = Math.ceil(response.totalHits / perPage);
  if (totalPages <= page) {
    // addClass(loadMoreRef, 'is-hidden');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
}

function infiniteScrollHandler() {
  const docRect = document.documentElement.getBoundingClientRect();

  if (totalPages === 1) return;

  if (docRect.bottom < document.documentElement.clientHeight + 350) {
    if (totalPages <= page) {
      removeClass(loaderRef, 'loader');
      return;
    }

    addClass(loaderRef, 'loader');
    page++;
    onLoadMore();
  }
}

export function removeClass(el, cl) {
  el.classList.remove(cl);
}

export function addClass(el, cl) {
  el.classList.add(cl);
}

function disableElement(el, value) {
  el.disabled = value;
}

function createSmoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

//~ Load more button
// function onLoadMore() {
//   page += 1;

//   getImages(inputValue, page)
//     .then(resp => {
//       disableElement(onLoadMore, true);

//       createMarkup(resp.hits);

//       insertMarkup(galleryRef, createMarkup(resp.hits));

//       checkPagesLeft(resp);

//       createSmoothScroll();
//     })
//     .catch(err => console.log(err))
//     .finally(() => disableElement(onLoadMore, false));
// }
