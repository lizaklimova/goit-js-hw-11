export function createMarkup(pics) {
  return pics.map(pic => createMarkupString(pic)).join('');
}

export function createMarkupString({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
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

export function insertMarkup(container, markup) {
  container.insertAdjacentHTML('beforeend', markup);
}

export function resetMarkup(el) {
  el.innerHTML = '';
}
