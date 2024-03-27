import { Cuisine, MealType, SpiceLevel } from './recipe.model';

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
  spiceLevel?: SpiceLevel[];
  type?: MealType[];
  culture?: Cuisine[];
};

export default RecipeFilter;
