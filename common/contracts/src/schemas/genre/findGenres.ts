import { type Genre } from './genre.js';

export interface FindGenresResponseBody {
  readonly data: Genre[];
}
