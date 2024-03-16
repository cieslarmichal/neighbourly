import { type Genre } from './genre.js';

export interface FindGenreByNameQueryParams {
  readonly name: string;
}

export type FindGenreByNameResponseBody = Genre;
