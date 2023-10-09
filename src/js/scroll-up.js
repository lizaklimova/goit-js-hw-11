import { scrollUpRef } from './refs';
import { addClass, removeClass } from './index';

addClass(scrollUpRef, 'is-hidden');

scrollUpRef.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

document.addEventListener('scroll', () => {
  if (document.documentElement.scrollTop > 300) {
    removeClass(scrollUpRef, 'is-hidden');
  } else {
    addClass(scrollUpRef, 'is-hidden');
  }
});
