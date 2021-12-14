const API_KEY = '24768000-69e119d8d67a6997f84a85579';
const BASE_URL = 'https://pixabay.com/api/';
import Notiflix from 'notiflix';
import axios from "axios";

export default class ImagesApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }
    async fetchImages() {
        try {
            const newImage = await axios(`${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`)
                .then(response => {
                    if (this.page === 1 && response.data.totalHits !== 0) {
                        Notiflix.Notify.success(`Hooray! We found ${response.data.totalHits} images.`);
                    };
                    if (response.data.hits.length === 0) {
                        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                        return;
                    };
                    this.incrementPage();
                    return response.data;
                });
            return newImage;
        }
        catch (error) {
            Notiflix.Notify.failure(`${error}`)
        }
    }
    incrementPage() {
    this.page += 1;
  }

    resetPage() {
    this.page = 1;
  }
    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }

}

   

