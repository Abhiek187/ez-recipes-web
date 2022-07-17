import { Recipe } from './recipe.model';

export const mockRecipe: Recipe = {
  id: 645710,
  name: 'Grilled Fish Sandwiches',
  url: 'https://spoonacular.com/grilled-fish-sandwiches-645710',
  image: 'https://spoonacular.com/recipeImages/645710-312x231.jpg',
  credit: 'Foodista.com – The Cooking Encyclopedia Everyone Can Edit',
  sourceUrl: 'http://www.foodista.com/recipe/GTGKFTFH/grilled-fish-sandwiches',
  healthScore: 17,
  time: 45,
  servings: 4,
  summary:
    'Grilled Fish Sandwiches might be just the main course you are searching for. This recipe makes 4 servings with <b>657 calories</b>, <b>39g of protein</b>, and <b>45g of fat</b> each. For <b>$4.26 per serving</b>, this recipe <b>covers 27%</b> of your daily requirements of vitamins and minerals. 1 person has made this recipe and would make it again. It can be enjoyed any time, but it is especially good for <b>The Fourth Of July</b>. It is a good option if you\'re following a <b>pescatarian</b> diet. Head to the store and pick up mayonnaise, another fish, garlic clove, and a few other things to make it today. All things considered, we decided this recipe <b>deserves a spoonacular score of 60%</b>. This score is pretty good. Try <a href="https://spoonacular.com/recipes/grilled-fish-sandwiches-86051">Grilled Fish Sandwiches</a>, <a href="https://spoonacular.com/recipes/blt-fish-sandwiches-85964">BLT Fish Sandwiches</a>, and <a href="https://spoonacular.com/recipes/fish-sandwiches-92724">Fish Sandwiches</a> for similar recipes.',
  nutrients: [
    {
      name: 'Calories',
      amount: 536.93,
      unit: 'kcal',
    },
    {
      name: 'Fat',
      amount: 31.65,
      unit: 'g',
    },
    {
      name: 'Saturated Fat',
      amount: 8.35,
      unit: 'g',
    },
    {
      name: 'Carbohydrates',
      amount: 24.04,
      unit: 'g',
    },
    {
      name: 'Fiber',
      amount: 1.64,
      unit: 'g',
    },
    {
      name: 'Sugar',
      amount: 4.37,
      unit: 'g',
    },
    {
      name: 'Protein',
      amount: 39.19,
      unit: 'g',
    },
    {
      name: 'Cholesterol',
      amount: 112.07,
      unit: 'mg',
    },
    {
      name: 'Sodium',
      amount: 1545.48,
      unit: 'mg',
    },
  ],
  ingredients: [
    {
      id: 1001,
      name: 'butter',
      amount: 0.5,
      unit: 'T',
    },
    {
      id: 10115261,
      name: 'fish',
      amount: 0.38,
      unit: 'lb',
    },
    {
      id: 11297,
      name: 'fresh parsley',
      amount: 0.38,
      unit: 'T',
    },
    {
      id: 11215,
      name: 'garlic clove',
      amount: 0.25,
      unit: '',
    },
    {
      id: 18350,
      name: 'hamburger buns',
      amount: 1,
      unit: '',
    },
    {
      id: 9152,
      name: 'lemon juice',
      amount: 0.5,
      unit: 'T',
    },
    {
      id: 4025,
      name: 'mayonnaise',
      amount: 0.13,
      unit: 'c',
    },
    {
      id: 11937,
      name: 'pickles',
      amount: 1,
      unit: 'servings',
    },
    {
      id: 2047,
      name: 'salt',
      amount: 0.13,
      unit: 'teaspoon',
    },
    {
      id: 1102047,
      name: 'Salt & Pepper',
      amount: 1,
      unit: 'servings',
    },
    {
      id: 1012028,
      name: 'smoked paprika',
      amount: 0.13,
      unit: 't',
    },
    {
      id: 4513,
      name: 'vegetable oil',
      amount: 1,
      unit: 'servings',
    },
    {
      id: 2046,
      name: 'yellow mustard',
      amount: 0.19,
      unit: 't',
    },
  ],
  instructions: [
    {
      name: '',
      steps: [
        {
          number: 1,
          step: 'In a small bowl, combine all of the ingredients for the aioli, season to taste with salt.Preheat a grill pan (a nonstick skillet can be used as well) over med-high heat until very hot.',
          ingredients: [
            {
              id: 93758,
              name: 'aioli',
              image: 'aioli.jpg',
            },
            {
              id: 2047,
              name: 'salt',
              image: 'salt.jpg',
            },
          ],
          equipment: [
            {
              id: 404648,
              name: 'grill pan',
              image: 'grill-pan.jpg',
            },
            {
              id: 404645,
              name: 'frying pan',
              image: 'pan.png',
            },
            {
              id: 404783,
              name: 'bowl',
              image: 'bowl.jpg',
            },
          ],
        },
        {
          number: 2,
          step: 'Brush the cut-sides of the buns with melted butter.',
          ingredients: [
            {
              id: 1001,
              name: 'butter',
              image: 'butter-sliced.jpg',
            },
            {
              id: 0,
              name: 'roll',
              image: 'dinner-yeast-rolls.jpg',
            },
          ],
          equipment: [],
        },
        {
          number: 3,
          step: 'Drizzle a little bit of oil into the pan and using a wad of paper towel, carefully wipe out the excess (you are just reinforcing your nonstick surface). Toast the buttered sides of the buns, then set aside while cooking the fish.Pat the fish dry and season with salt & pepper (or seasoning of your choice).',
          ingredients: [
            {
              id: 1102047,
              name: 'salt and pepper',
              image: 'salt-and-pepper.jpg',
            },
            {
              id: 1042027,
              name: 'seasoning',
              image: 'seasoning.png',
            },
            {
              id: 18070,
              name: 'toast',
              image: 'toast',
            },
            {
              id: 0,
              name: 'roll',
              image: 'dinner-yeast-rolls.jpg',
            },
            {
              id: 10115261,
              name: 'fish',
              image: 'fish-fillet.jpg',
            },
            {
              id: 4582,
              name: 'cooking oil',
              image: 'vegetable-oil.jpg',
            },
          ],
          equipment: [
            {
              id: 405895,
              name: 'paper towels',
              image: 'paper-towels.jpg',
            },
            {
              id: 404645,
              name: 'frying pan',
              image: 'pan.png',
            },
          ],
        },
        {
          number: 4,
          step: 'Drizzle a little bit of oil over the fish and rub it over the entire surface of the fish to evenly coat with oil.',
          ingredients: [
            {
              id: 10115261,
              name: 'fish',
              image: 'fish-fillet.jpg',
            },
            {
              id: 4582,
              name: 'cooking oil',
              image: 'vegetable-oil.jpg',
            },
            {
              id: 1012034,
              name: 'dry seasoning rub',
              image: 'seasoning.png',
            },
          ],
          equipment: [],
        },
        {
          number: 5,
          step: 'Add the fish to the hot pan and cook, turning once, until the fish is cooked through (cooking time will vary based on the thickness of your fish, somewhere between 2-4 minutes per side).erve the fish on the toasted buns, slathered with the aioli and toppings of choice.',
          ingredients: [
            {
              id: 93758,
              name: 'aioli',
              image: 'aioli.jpg',
            },
            {
              id: 0,
              name: 'roll',
              image: 'dinner-yeast-rolls.jpg',
            },
            {
              id: 10115261,
              name: 'fish',
              image: 'fish-fillet.jpg',
            },
          ],
          equipment: [
            {
              id: 404645,
              name: 'frying pan',
              image: 'pan.png',
            },
          ],
        },
      ],
    },
  ],
};
