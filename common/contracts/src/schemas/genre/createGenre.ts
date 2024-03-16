import { type Genre } from './genre.js';

export interface CreateGenreRequestBody {
  readonly name: string;
}

export type CreateGenreResponseBody = Genre;
