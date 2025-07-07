import { HttpParams, HttpUrlEncodingCodec } from '@angular/common/http';
import RecipeFilter from '../models/recipe-filter.model';

class RecipeFilterEncoder implements HttpUrlEncodingCodec {
  encodeKey(key: string): string {
    // Convert all keys from camelCase to kebab-case
    return encodeURIComponent(
      key.replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
    );
  }

  encodeValue(value: string): string {
    // Use the default encode method by default
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    // Use the default decode method by default
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

const recipeFilterParams = (filter: RecipeFilter): HttpParams => {
  let params = new HttpParams({
    fromObject: filter,
    encoder: new RecipeFilterEncoder(),
  });

  for (const key of Object.keys(filter) as (keyof RecipeFilter)[]) {
    // Keep just the key if true, otherwise remove key
    if (typeof filter[key] === 'boolean') {
      params = filter[key] ? params.set(key, '') : params.delete(key);
    }
  }

  return params;
};

export default recipeFilterParams;
