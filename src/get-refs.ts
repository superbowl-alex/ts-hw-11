export interface Refs {
  form: HTMLFormElement | null;
  input: HTMLInputElement | null;
  gallery: HTMLElement | null;
};

// create references to DOM elements
export function getRefs(): Refs {
  return {
    form: document.querySelector('.search-form') as HTMLFormElement | null,
    input: document.querySelector('.search-form__input') as HTMLInputElement | null,
    gallery: document.querySelector('.gallery') as HTMLElement | null,
  };
}
