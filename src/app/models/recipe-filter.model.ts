import { Cuisine, MealType, SpiceLevel } from './recipe.model';

export const RECIPE_SORT_FIELDS = [
  'calories',
  'health-score',
  'rating',
  'views',
] as const;
export type RecipeSortField = (typeof RECIPE_SORT_FIELDS)[number];
export const isValidSortField = (str: string): str is RecipeSortField => {
  return RECIPE_SORT_FIELDS.includes(str as RecipeSortField);
};

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
  sort?: RecipeSortField;
  asc?: boolean;
};

export default RecipeFilter;
