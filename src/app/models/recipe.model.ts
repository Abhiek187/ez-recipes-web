export const SPICE_LEVELS = ['none', 'mild', 'spicy', 'unknown'] as const;
export type SpiceLevel = (typeof SPICE_LEVELS)[number];
export const isValidSpiceLevel = (
  str: string
): str is Exclude<SpiceLevel, 'unknown'> => {
  return SPICE_LEVELS.includes(str as SpiceLevel) && str !== 'unknown';
};

export const MEAL_TYPES = [
  'main course',
  'side dish',
  'dessert',
  'appetizer',
  'salad',
  'bread',
  'breakfast',
  'soup',
  'beverage',
  'sauce',
  'marinade',
  'fingerfood',
  'snack',
  'drink',
  'antipasti',
  'starter',
  'antipasto',
  "hor d'oeuvre",
  'lunch',
  'main dish',
  'dinner',
  'morning meal',
  'brunch',
  'condiment',
  'dip',
  'spread',
] as const;
export type MealType = (typeof MEAL_TYPES)[number];
export const isValidMealType = (str: string): str is MealType => {
  return MEAL_TYPES.includes(str as MealType);
};

export const CUISINES = [
  'African',
  'Asian',
  'American',
  'British',
  'Cajun',
  'Caribbean',
  'Chinese',
  'Eastern European',
  'European',
  'French',
  'German',
  'Greek',
  'Indian',
  'Irish',
  'Italian',
  'Japanese',
  'Jewish',
  'Korean',
  'Latin American',
  'Mediterranean',
  'Mexican',
  'Middle Eastern',
  'Nordic',
  'Southern',
  'Spanish',
  'Thai',
  'Vietnamese',
  'English',
  'Scottish',
  'South American',
  'Creole',
  'Central American',
] as const;
export type Cuisine = (typeof CUISINES)[number];
export const isValidCuisine = (str: string): str is Cuisine => {
  return CUISINES.includes(str as Cuisine);
};

type Recipe = {
  _id?: string;
  id: number;
  name: string;
  url?: string;
  image: string;
  credit: string;
  sourceUrl: string;
  healthScore: number;
  time: number;
  servings: number;
  summary: string;
  types: MealType[];
  spiceLevel: SpiceLevel;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isHealthy: boolean;
  isCheap: boolean;
  isSustainable: boolean;
  culture: Cuisine[];
  //allergies: string[];
  nutrients: {
    name: string;
    amount: number;
    unit: string;
  }[];
  ingredients: {
    id: number;
    name: string;
    amount: number;
    unit: string;
  }[];
  instructions: {
    name: string;
    steps: {
      number: number;
      step: string;
      ingredients: {
        id: number;
        name: string;
        image: string;
      }[];
      equipment: {
        id: number;
        name: string;
        image: string;
      }[];
    }[];
  }[];
  token?: string; // searchSequenceToken for pagination
};

export default Recipe;

export interface RecipeWithTimestamp extends Recipe {
  timestamp: number;
}
