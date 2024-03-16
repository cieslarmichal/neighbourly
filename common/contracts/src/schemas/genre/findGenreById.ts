import { type Genre } from './genre.js';

export interface FindGenreByIdPathParams {
  readonly id: string;
}

export type FindGenreByIdResponseBody = Genre;
