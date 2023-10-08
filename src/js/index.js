import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import throttle from 'lodash.throttle';
import { formRef, galleryRef, loadMoreRef, searchBtn } from './refs';
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

let page;
let perPage = 40;
let inputValue = null;

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
  // page += 1;
  // getImages(inputValue, page)
  //   .then(resp => {
  //     createMarkup(resp.hits);
  //     insertMarkup(galleryRef, createMarkup(resp.hits));
  //     checkPagesLeft(resp);
  //   })
  //   .catch(err => console.log(err));
}

function infiniteScrollHandler(totHits) {
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    page += 1;

    getImages(inputValue, page)
      .then(resp => {
        createMarkup(resp.hits);

        insertMarkup(galleryRef, createMarkup(resp.hits));

        checkPagesLeft(resp);
      })
      .catch(err => console.log(err));
  }
}

function checkPagesLeft(response) {
  const availablePages = Math.ceil(response.totalHits / perPage);
  if (availablePages === page) {
    // addClass(loadMoreRef, 'is-hidden');
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
}

// function removeClass(el, cl) {
//   el.classList.remove(cl);
// }

// function addClass(el, cl) {
//   el.classList.add(cl);
// }

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
