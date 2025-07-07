import { Cuisine, MealType, SpiceLevel } from './recipe.model';

// type is needed instead of interface when passing to HttpParams:
// https://stackoverflow.com/a/71394297
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type RecipeFilter = {
  query?: string;
  minCals?: number;
  maxCals?: number;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  healthy?: boolean;
  cheap?: boolean;
  sustainable?: boolean;
  rating?: number;
  spiceLevel?: SpiceLevel[];
  type?: MealType[];
  culture?: Cuisine[];
  token?: string; // either an ObjectId or searchSequenceToken for pagination
};

export default RecipeFilter;
