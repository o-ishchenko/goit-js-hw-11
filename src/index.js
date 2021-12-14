import './css/styles.css';
import ImagesApiService from './js/ImagesApiService';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const FormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const imagesApiService = new ImagesApiService();
const simpleLightBox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
});

FormEl.addEventListener('submit', onSearch);
loadMoreBtnEl.addEventListener('click', onLoadMoreClick)

function onSearch(event) {
    event.preventDefault();
    imagesApiService.query = event.currentTarget.elements.searchQuery.value.trim();
    loadMoreBtnEl.classList.add('is-hidden');
    imagesApiService.resetPage();
    galleryEl.innerHTML = '';
   
    if (imagesApiService.query) {
        imagesApiService.fetchImages( )
            .then(data => {                
                if (data.hits.length < 40) {
                    Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
                    loadMoreBtnEl.classList.add('is-hidden');
                    renderImagesList(data);
                    return;
                }
                loadMoreBtnEl.classList.remove('is-hidden');
                renderImagesList(data);
            })
    }
}

function onLoadMoreClick() {
    
    imagesApiService.fetchImages().then(data => {
        if (data.hits.length < 40) {             
            Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
            loadMoreBtnEl.classList.add('is-hidden');
            renderImagesList(data);
            return;
        };
        renderImagesList(data);
        
    });
}

function renderImagesList(data) {
    const imagesList = data.hits.map(item => `
    <a class="photo-card"href="${item.largeImageURL}">
    <div >
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
        <p class="info-item">
        <b>Likes</b> <span>${item.likes}</span>
        </p>
        <p class="info-item">
        <b>Views</b><span>${item.views}</span>
        </p>
        <p class="info-item">
        <b>Comments</b><span>${item.comments}</span>
        </p>
        <p class="info-item">
        <b>Downloads</b><span>${item.downloads}</span>
        </p>
    </div>
    </div>
    </a>
    `).join('');
    galleryEl.insertAdjacentHTML('beforeend', imagesList);
    simpleLightBox.refresh();
    
 }
