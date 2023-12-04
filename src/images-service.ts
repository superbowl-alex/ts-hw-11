//API for requesting and receiving data from the server
import axios, { AxiosResponse } from 'axios';
// My API key is stored in a constant
const API_KEY = '29385448-a71fcce374d47abba8b3fae94';

export interface Hit {
  comments: number,
  downloads: number,
  likes: number,
  views: number,
  largeImageURL: string,
  webformatURL: string,
  tags: string,
}

export interface Data {
  totalHits: number;
  hits: Hit[];
}

export default class ImagesApiService {
  public readonly HITS_PER_PAGE: number;
  private searchQuery: string;
  public page: number;
  public isLoading: boolean;

  constructor() {
    this.HITS_PER_PAGE = 40;
    this.searchQuery = '';
    this.page = 1;
    this.isLoading = false;
  }

  async fetchImages(): Promise<AxiosResponse<Data>> {
    axios.defaults.baseURL = 'https://pixabay.com/api';
    this.isLoading = true;
    const response: AxiosResponse<Data> = await axios.get(
      `/?key=${API_KEY}&q=${this.searchQuery}&page=${this.page}&per_page=${this.HITS_PER_PAGE}&image_type=photo&orientation=horizontal&safesearch=true`
    );
    this.incrementPage();
    this.isLoading = false;
    return response;
  }

  incrementPage(): void {
    this.page += 1;
  }

  resetPage(): void {
    this.page = 1;
  }

  get query(): string {
    return this.searchQuery;
  }

  set query(newQuery: string) {
    this.searchQuery = newQuery;
  }
}

