import { type Genre } from './genre.js';

export interface UpdateGenreNamePathParams {
  readonly id: string;
}

export interface UpdateGenreNameRequestBody {
  readonly name: string;
}

export type UpdateGenreNameResponseBody = Genre;
