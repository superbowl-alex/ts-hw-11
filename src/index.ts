// Import required packages, entities and modules
import Notiflix from 'notiflix';
import markup from './markup';
import { Refs, getRefs } from './get-refs';
import { Hit, Data } from "./images-service";
import ImagesApiService from './images-service';
import { AxiosResponse } from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import OnlyScroll from 'only-scrollbar';

// Initializing references to DOM elements
const refs: Refs = getRefs();
// Total number of pages in backend response
let totalPages: number = 0;
// Boolean variable that signals that we have reached the end of the collection
let overflow: boolean = false;

// Creating an instance of a class OnlyScroll (adds inertia for increased smoothness)
const scroll = new OnlyScroll(document.scrollingElement, {
  damping: 0.7,
});

// Creating an instance of a class ImagesApiService
const imagesApiService: ImagesApiService = new ImagesApiService();

// Add eventListener to the form
refs.form?.addEventListener('submit', onSearch);

// Creating an instance of a class SimpleLightbox
const lightbox: any = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});
lightbox.on('show.lightbox');

// Function that run on the form submit
function onSearch(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  let currentQuery = form.elements.namedItem('searchQuery') as HTMLInputElement;
  if (!currentQuery || !currentQuery.value.trim()) {
    return;
  }

  const currentQueryValue = currentQuery.value.trim();
  if (imagesApiService.query === currentQueryValue) {
    return;
  }

  clearOutput();
  imagesApiService.query = currentQueryValue;
  imagesApiService.resetPage();

  if (!imagesApiService.query) {
    return;
  } else {
    imagesApiService
      .fetchImages()
      .then(({ data }: AxiosResponse<Data>) => {
        totalPages = Math.ceil(data.totalHits / imagesApiService.HITS_PER_PAGE);
        validationData(data);
        render(data);
      })
      .catch((error: Error) => console.log(error));
  }
}

// Creating an object of the IntersectionObserver class that monitors the need to access the backend for a new piece of data
let observer = new IntersectionObserver(([entry], observer) => {
  if (entry.isIntersecting) {
    observer.unobserve(entry.target);
    if (!imagesApiService.isLoading && !overflow) {
      onLoadMore();
    }
  }
}, {});

// A function that calls the server when more images need to be loaded
function onLoadMore(): void {
  imagesApiService
    .fetchImages()
    .then(({ data }: AxiosResponse<Data>) => {
      render(data);
      if (imagesApiService.page > totalPages) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
        overflow = true;
      }
    })
    .catch((error: Error) => console.log(error));
}

// Output cleaning function
function clearOutput(): void {
  if(refs.gallery) refs.gallery.innerHTML = '';
}

// Markup render function
function render(data: Data): void {
  refs.gallery?.insertAdjacentHTML(
    'beforeend',
    data.hits.map((hit: Hit) => markup(hit)).join('')
  );

  const lastChild: any = refs.gallery?.lastElementChild;
  const lastCard: HTMLElement | null = lastChild instanceof HTMLElement ? lastChild : null;
    if (lastCard) {
    observer.observe(lastCard);
  }

  lightbox.refresh();
}

// Backend response validation
function validationData(data: Data): void {
  // If no images were found for your request
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  // If pictures were found according to your request
  else {
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
  }
}
