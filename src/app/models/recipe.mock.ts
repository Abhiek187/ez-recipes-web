import { Recipe } from './recipe.model';

// Abstract classes can hold static properties to group the mock recipes together
abstract class MockRecipes {
  /**
   * Normal
   */
  static readonly grilledFish: Recipe = {
    id: 645710,
    name: 'Grilled Fish Sandwiches',
    url: 'https://spoonacular.com/grilled-fish-sandwiches-645710',
    image: 'https://spoonacular.com/recipeImages/645710-312x231.jpg',
    credit: 'Foodista.com – The Cooking Encyclopedia Everyone Can Edit',
    sourceUrl:
      'http://www.foodista.com/recipe/GTGKFTFH/grilled-fish-sandwiches',
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

  /**
   * Lots of steps, missing ingredient image
   */
  static readonly gingerbread: Recipe = {
    id: 64694,
    name: 'Gingerbread',
    url: 'https://spoonacular.com/gingerbread-64694',
    image: 'https://spoonacular.com/recipeImages/64694-312x231.jpg',
    credit: 'Foodista.com – The Cooking Encyclopedia Everyone Can Edit',
    sourceUrl: 'https://www.foodista.com/recipe/ZT6VVCSS/gingerbread',
    healthScore: 2,
    time: 45,
    servings: 14,
    summary:
      'The recipe Gingerbread can be made <b>in roughly roughly 45 minutes</b>. One portion of this dish contains around <b>3g of protein</b>, <b>2g of fat</b>, and a total of <b>214 calories</b>. This recipe serves 14 and costs 40 cents per serving. It works well as a dessert. 18 people were glad they tried this recipe. If you have flour, soda, eggs, and a few other ingredients on hand, you can make it. It is perfect for <b>Christmas</b>. It is brought to you by Foodista. It is a good option if you\'re following a <b>dairy free and lacto ovo vegetarian</b> diet. With a spoonacular <b>score of 25%</b>, this dish is not so great. Similar recipes are <a href="https://spoonacular.com/recipes/luxe-gingerbread-house-decorating-party-gingerbread-truffle-martini-954088">Luxe Gingerbread House Decorating Party & Gingerbread Truffle Martini</a>, <a href="https://spoonacular.com/recipes/gingerbread-cake-with-creamy-gingerbread-frosting-64551">Gingerbread Cake With Creamy Gingerbread Frosting</a>, and <a href="https://spoonacular.com/recipes/gingerbread-m-m-cookie-bars-with-gingerbread-m-m-buttercream-493468">Gingerbread M&M Cookie Bars with Gingerbread M&M Buttercream</a>.',
    nutrients: [
      {
        name: 'Calories',
        amount: 227.56,
        unit: 'kcal',
      },
      {
        name: 'Fat',
        amount: 4.05,
        unit: 'g',
      },
      {
        name: 'Saturated Fat',
        amount: 0.47,
        unit: 'g',
      },
      {
        name: 'Carbohydrates',
        amount: 46.02,
        unit: 'g',
      },
      {
        name: 'Fiber',
        amount: 0.56,
        unit: 'g',
      },
      {
        name: 'Sugar',
        amount: 32.32,
        unit: 'g',
      },
      {
        name: 'Protein',
        amount: 2.65,
        unit: 'g',
      },
      {
        name: 'Cholesterol',
        amount: 23.38,
        unit: 'mg',
      },
      {
        name: 'Sodium',
        amount: 22.43,
        unit: 'mg',
      },
    ],
    ingredients: [
      {
        id: 19304,
        name: 'molasses',
        amount: 0.07,
        unit: 'cup',
      },
      {
        id: 2047,
        name: 'salt',
        amount: 0.07,
        unit: 'Dash',
      },
      {
        id: 1123,
        name: 'eggs',
        amount: 0.14,
        unit: '',
      },
      {
        id: 1004582,
        name: 'salad oil',
        amount: 0.07,
        unit: 'cup',
      },
      {
        id: 19335,
        name: 'sugar',
        amount: 0.07,
        unit: 'cup',
      },
      {
        id: 14146,
        name: 'diet soda',
        amount: 0.14,
        unit: 'teaspoons',
      },
      {
        id: 14412,
        name: 'water',
        amount: 0.11,
        unit: 'cups',
      },
      {
        id: 20081,
        name: 'flour',
        amount: 0.14,
        unit: 'cups',
      },
      {
        id: 11216,
        name: 'ginger',
        amount: 0.07,
        unit: 'teaspoon',
      },
      {
        id: 2010,
        name: 'cinnamon',
        amount: 0.07,
        unit: 'teaspoon',
      },
    ],
    instructions: [
      {
        name: '',
        steps: [
          {
            number: 1,
            step: 'Mix molasses, salad oil, sugar, spices and salt.',
            ingredients: [
              {
                id: 1004582,
                name: 'salad oil',
                image: 'olive-oil.jpg',
              },
              {
                id: 19304,
                name: 'molasses',
                image: 'molasses.jpg',
              },
              {
                id: 2035,
                name: 'spices',
                image: 'spices.png',
              },
              {
                id: 19335,
                name: 'sugar',
                image: 'sugar-in-bowl.png',
              },
              {
                id: 2047,
                name: 'salt',
                image: 'salt.jpg',
              },
            ],
            equipment: [],
          },
          {
            number: 2,
            step: 'Add eggs and beat.',
            ingredients: [
              {
                id: 1123,
                name: 'egg',
                image: 'egg.png',
              },
            ],
            equipment: [],
          },
          {
            number: 3,
            step: 'Add soda which has been dissolved in 1/8 cup boiling water and stir.',
            ingredients: [
              {
                id: 14412,
                name: 'water',
                image: 'water.png',
              },
              {
                id: 0,
                name: 'pop',
                image: '',
              },
            ],
            equipment: [],
          },
          {
            number: 4,
            step: 'Add flour and rest of water. Batter will be thin.',
            ingredients: [
              {
                id: 20081,
                name: 'all purpose flour',
                image: 'flour.png',
              },
              {
                id: 14412,
                name: 'water',
                image: 'water.png',
              },
            ],
            equipment: [],
          },
          {
            number: 5,
            step: 'Pour in 9"x13" pan.',
            ingredients: [],
            equipment: [
              {
                id: 404645,
                name: 'frying pan',
                image: 'pan.png',
              },
            ],
          },
          {
            number: 6,
            step: 'Bake at 350 degrees until done.',
            ingredients: [],
            equipment: [
              {
                id: 404784,
                name: 'oven',
                image: 'oven.jpg',
              },
            ],
          },
          {
            number: 7,
            step: 'Serve either hot or cold. May add Glaze.',
            ingredients: [
              {
                id: 0,
                name: 'glaze',
                image: '',
              },
            ],
            equipment: [],
          },
          {
            number: 8,
            step: 'GLAZE: 1 stick butter, 1/4 cup milk and 1 cup brown sugar.',
            ingredients: [
              {
                id: 19334,
                name: 'brown sugar',
                image: 'dark-brown-sugar.png',
              },
              {
                id: 1001,
                name: 'butter',
                image: 'butter-sliced.jpg',
              },
              {
                id: 0,
                name: 'glaze',
                image: '',
              },
              {
                id: 1077,
                name: 'milk',
                image: 'milk.png',
              },
            ],
            equipment: [],
          },
          {
            number: 9,
            step: 'Mix all together and bring to boil. Boil for about 4 minutes.',
            ingredients: [],
            equipment: [],
          },
          {
            number: 10,
            step: 'Drizzle over gingerbread.',
            ingredients: [],
            equipment: [],
          },
        ],
      },
    ],
  };

  /**
   * Missing image credit
   */
  static readonly jambalayaStew: Recipe = {
    id: 648432,
    name: 'Jambalaya Stew',
    url: 'https://spoonacular.com/jambalaya-stew-648432',
    image: 'https://spoonacular.com/recipeImages/648432-312x231.jpg',
    credit: null,
    sourceUrl: 'https://www.foodista.com/recipe/HG72GN7R/jambalaya-stew',
    healthScore: 30,
    time: 45,
    servings: 4,
    summary:
      'Jambalaya Stew might be a good recipe to expand your main course recipe box. This recipe serves 4 and costs $2.27 per serving. Watching your figure? This gluten free and dairy free recipe has <b>289 calories</b>, <b>21g of protein</b>, and <b>8g of fat</b> per serving. From preparation to the plate, this recipe takes roughly <b>roughly 45 minutes</b>. It is brought to you by Foodista. <b>Autumn</b> will be even more special with this recipe. If you have cajun seasoning, canned tomatoes, shrimp, and a few other ingredients on hand, you can make it. This recipe is liked by 11 foodies and cooks. It is an <b>affordable</b> recipe for fans of Cajun food. All things considered, we decided this recipe <b>deserves a spoonacular score of 80%</b>. This score is great. Users who liked this recipe also liked <a href="https://spoonacular.com/recipes/jambalaya-stew-34848">Jambalaya Stew</a>, <a href="https://spoonacular.com/recipes/gumbo-laya-gumbo-+-jambalaya-stew-793549">Gumbo-laya” (Gumbo + Jambalaya) Stew</a>, and <a href="https://spoonacular.com/recipes/jambalaya-1079154">Jambalaya</a>.',
    nutrients: [
      {
        name: 'Calories',
        amount: 282.59,
        unit: 'kcal',
      },
      {
        name: 'Fat',
        amount: 7.76,
        unit: 'g',
      },
      {
        name: 'Saturated Fat',
        amount: 1.62,
        unit: 'g',
      },
      {
        name: 'Carbohydrates',
        amount: 35.85,
        unit: 'g',
      },
      {
        name: 'Fiber',
        amount: 4.39,
        unit: 'g',
      },
      {
        name: 'Sugar',
        amount: 6.81,
        unit: 'g',
      },
      {
        name: 'Protein',
        amount: 20.89,
        unit: 'g',
      },
      {
        name: 'Cholesterol',
        amount: 98.49,
        unit: 'mg',
      },
      {
        name: 'Sodium',
        amount: 678.57,
        unit: 'mg',
      },
    ],
    ingredients: [
      {
        id: 93668,
        name: 'chicken sausage links',
        amount: 1.5,
        unit: 'oz',
      },
      {
        id: 10011693,
        name: 'canned tomatoes',
        amount: 3.63,
        unit: 'oz',
      },
      {
        id: 11282,
        name: 'onion',
        amount: 0.19,
        unit: 'cup',
      },
      {
        id: 11951,
        name: 'yellow bell pepper',
        amount: 0.25,
        unit: 'large',
      },
      {
        id: 11143,
        name: 'celery',
        amount: 0.25,
        unit: 'cup',
      },
      {
        id: 6970,
        name: 'low sodium chicken broth',
        amount: 0.25,
        unit: 'cup',
      },
      {
        id: 20040,
        name: 'brown rice',
        amount: 0.13,
        unit: 'cup',
      },
      {
        id: 11215,
        name: 'garlic',
        amount: 0.25,
        unit: 'tbsp',
      },
      {
        id: 1032028,
        name: 'cajun seasoning',
        amount: 0.25,
        unit: 'tsp',
      },
      {
        id: 6168,
        name: 'hot sauce',
        amount: 0.13,
        unit: 'tsp',
      },
      {
        id: 2027,
        name: 'oregano',
        amount: 0.06,
        unit: 'tsp',
      },
      {
        id: 2042,
        name: 'dried thyme',
        amount: 0.06,
        unit: 'tsp',
      },
      {
        id: 15270,
        name: 'raw shrimp',
        amount: 1.5,
        unit: 'oz',
      },
    ],
    instructions: [
      {
        name: '',
        steps: [
          {
            number: 1,
            step: 'Add all ingredients except shrimp to a large pot on the stove.',
            ingredients: [
              {
                id: 15270,
                name: 'shrimp',
                image: 'shrimp.png',
              },
            ],
            equipment: [
              {
                id: 404794,
                name: 'stove',
                image: 'oven.jpg',
              },
              {
                id: 404752,
                name: 'pot',
                image: 'stock-pot.jpg',
              },
            ],
          },
          {
            number: 2,
            step: 'Mix thoroughly. Bring to a boil.',
            ingredients: [],
            equipment: [],
          },
          {
            number: 3,
            step: 'Reduce heat to medium low. Cover and simmer until vegetables are tender and rice is fluffy, about 35 minutes.',
            ingredients: [
              {
                id: 11583,
                name: 'vegetable',
                image: 'mixed-vegetables.png',
              },
              {
                id: 20444,
                name: 'rice',
                image: 'uncooked-white-rice.png',
              },
            ],
            equipment: [],
          },
          {
            number: 4,
            step: 'Add shrimp and re-cover. Continue to cook until shrimp are tender and cooked through, about 6 minutes.',
            ingredients: [
              {
                id: 15270,
                name: 'shrimp',
                image: 'shrimp.png',
              },
            ],
            equipment: [],
          },
          {
            number: 5,
            step: 'If you like, season to taste with salt, black pepper, and additional hot sauce.',
            ingredients: [
              {
                id: 1002030,
                name: 'black pepper',
                image: 'pepper.jpg',
              },
              {
                id: 6168,
                name: 'hot sauce',
                image: 'hot-sauce-or-tabasco.png',
              },
              {
                id: 2047,
                name: 'salt',
                image: 'salt.jpg',
              },
            ],
            equipment: [],
          },
          {
            number: 6,
            step: 'Serve and enjoy!!!',
            ingredients: [],
            equipment: [],
          },
        ],
      },
    ],
  };

  /**
   * Contains instruction name
   */
  static readonly chocolateCupcake: Recipe = {
    id: 644783,
    name: 'Gluten And Dairy Free Chocolate Cupcakes',
    url: 'https://spoonacular.com/gluten-and-dairy-free-chocolate-cupcakes-644783',
    image: 'https://spoonacular.com/recipeImages/644783-312x231.jpg',
    credit: 'Foodista.com – The Cooking Encyclopedia Everyone Can Edit',
    sourceUrl:
      'https://www.foodista.com/recipe/PDGXCHNP/gluten-and-dairy-free-chocolate-cupcakes',
    healthScore: 3,
    time: 45,
    servings: 4,
    summary:
      'The recipe Gluten And Dairy Free Chocolate Cupcakes can be made <b>in approximately about 45 minutes</b>. One serving contains <b>919 calories</b>, <b>15g of protein</b>, and <b>52g of fat</b>. This gluten free and fodmap friendly recipe serves 4 and costs <b>$2.23 per serving</b>. It works well as a budget friendly dessert. Not a lot of people made this recipe, and 1 would say it hit the spot. Head to the store and pick up cocoa, xanthan gum, baking soda, and a few other things to make it today. This recipe is typical of American cuisine. It is brought to you by Foodista. Overall, this recipe earns a <b>rather bad spoonacular score of 23%</b>. Similar recipes are <a href="https://spoonacular.com/recipes/gluten-free-dairy-free-chocolate-zucchini-cupcakes-557465">Gluten Free Dairy Free Chocolate Zucchini Cupcakes</a>, <a href="https://spoonacular.com/recipes/grain-free-gluten-free-and-dairy-free-spiced-applesauce-cupcakes-615243">Grain-free, Gluten-free and Dairy-free Spiced Applesauce Cupcakes</a>, and <a href="https://spoonacular.com/recipes/gluten-free-chocolate-cupcakes-made-with-garbanzo-bean-flour-my-best-gluten-free-cupcakes-to-date-518499">Gluten-Free Chocolate Cupcakes Made With Garbanzo Bean Flour – My Best Gluten-Free Cupcakes To Date</a>.',
    nutrients: [
      {
        name: 'Calories',
        amount: 918.45,
        unit: 'kcal',
      },
      {
        name: 'Fat',
        amount: 52.47,
        unit: 'g',
      },
      {
        name: 'Saturated Fat',
        amount: 31.75,
        unit: 'g',
      },
      {
        name: 'Carbohydrates',
        amount: 108.17,
        unit: 'g',
      },
      {
        name: 'Fiber',
        amount: 12.57,
        unit: 'g',
      },
      {
        name: 'Sugar',
        amount: 74.85,
        unit: 'g',
      },
      {
        name: 'Protein',
        amount: 14.53,
        unit: 'g',
      },
      {
        name: 'Cholesterol',
        amount: 279.85,
        unit: 'mg',
      },
      {
        name: 'Sodium',
        amount: 916.11,
        unit: 'mg',
      },
    ],
    ingredients: [
      {
        id: 93747,
        name: 'coconut flour',
        amount: 0.13,
        unit: 'cup',
      },
      {
        id: 93696,
        name: 'tapioca flour',
        amount: 0.13,
        unit: 'cup',
      },
      {
        id: 18372,
        name: 'baking soda',
        amount: 0.25,
        unit: 'teaspoon',
      },
      {
        id: 2047,
        name: 'salt',
        amount: 0.13,
        unit: 'teaspoon',
      },
      {
        id: 93626,
        name: 'xanthan gum',
        amount: 0.13,
        unit: 'teaspoon',
      },
      {
        id: 19165,
        name: 'cocoa',
        amount: 0.13,
        unit: 'cup',
      },
      {
        id: 14412,
        name: 'water',
        amount: 0.25,
        unit: 'cup',
      },
      {
        id: 1123,
        name: 'eggs',
        amount: 1.25,
        unit: '',
      },
      {
        id: 2050,
        name: 'vanilla',
        amount: 0.25,
        unit: 'tablespoon',
      },
      {
        id: 1001,
        name: 'butter',
        amount: 2.5,
        unit: 'tablespoons',
      },
      {
        id: 19335,
        name: 'sugar',
        amount: 0.25,
        unit: 'cup',
      },
      {
        id: 98848,
        name: 'dairy free chocolate chips',
        amount: 0.25,
        unit: 'cup',
      },
      {
        id: 98976,
        name: 'coconut creamer',
        amount: 0.13,
        unit: 'cup',
      },
      {
        id: 14214,
        name: 'instant coffee',
        amount: 0.5,
        unit: 'teaspoons',
      },
    ],
    instructions: [
      {
        name: '',
        steps: [
          {
            number: 1,
            step: 'Preheat oven to 375 degrees.',
            ingredients: [],
            equipment: [
              {
                id: 404784,
                name: 'oven',
                image: 'oven.jpg',
              },
            ],
          },
          {
            number: 2,
            step: 'Bring the water to a boil. Stir in the cocoa until melted and set aside until it comes to room temperature.',
            ingredients: [
              {
                id: 19165,
                name: 'cocoa powder',
                image: 'cocoa-powder.png',
              },
              {
                id: 14412,
                name: 'water',
                image: 'water.png',
              },
            ],
            equipment: [],
          },
          {
            number: 3,
            step: 'Stir together the coconut flour, cornstarch, xanthan gum, salt, and soda.',
            ingredients: [
              {
                id: 93747,
                name: 'coconut flour',
                image: 'coconut-flour-or-other-gluten-free-flour.jpg',
              },
              {
                id: 93626,
                name: 'xanthan gum',
                image: 'white-powder.jpg',
              },
              {
                id: 20027,
                name: 'corn starch',
                image: 'white-powder.jpg',
              },
              {
                id: 2047,
                name: 'salt',
                image: 'salt.jpg',
              },
              {
                id: 0,
                name: 'pop',
                image: '',
              },
            ],
            equipment: [],
          },
          {
            number: 4,
            step: "Mix together well. If you have a sifter go ahead and sift it to get out all the clumps. You don't want to bite into your cupcake and get a clump of coconut flour. I don't have a sifter so I used my hands to de-clump the flour the best I can.",
            ingredients: [
              {
                id: 93747,
                name: 'coconut flour',
                image: 'coconut-flour-or-other-gluten-free-flour.jpg',
              },
              {
                id: 18139,
                name: 'cupcakes',
                image: 'plain-cupcake.jpg',
              },
              {
                id: 20081,
                name: 'all purpose flour',
                image: 'flour.png',
              },
            ],
            equipment: [
              {
                id: 404708,
                name: 'sifter',
                image: 'sifter.jpg',
              },
            ],
          },
          {
            number: 5,
            step: 'Beat together the butter and sugar.',
            ingredients: [
              {
                id: 1001,
                name: 'butter',
                image: 'butter-sliced.jpg',
              },
              {
                id: 19335,
                name: 'sugar',
                image: 'sugar-in-bowl.png',
              },
            ],
            equipment: [],
          },
          {
            number: 6,
            step: 'Beat in the eggs, one at a time, then the vanilla. Scraping down the bowl as necessary.',
            ingredients: [
              {
                id: 1052050,
                name: 'vanilla',
                image: 'vanilla.jpg',
              },
              {
                id: 1123,
                name: 'egg',
                image: 'egg.png',
              },
            ],
            equipment: [
              {
                id: 404783,
                name: 'bowl',
                image: 'bowl.jpg',
              },
            ],
          },
          {
            number: 7,
            step: 'Add the flour mixture and beat until incorporated. Again, you might need to scrape down the bowl.',
            ingredients: [
              {
                id: 20081,
                name: 'all purpose flour',
                image: 'flour.png',
              },
            ],
            equipment: [
              {
                id: 404783,
                name: 'bowl',
                image: 'bowl.jpg',
              },
            ],
          },
          {
            number: 8,
            step: 'Add in the cocoa mixture and beat until smooth. Batter will be thin.',
            ingredients: [
              {
                id: 19165,
                name: 'cocoa powder',
                image: 'cocoa-powder.png',
              },
            ],
            equipment: [],
          },
          {
            number: 9,
            step: 'Line a muffin tin with baking cups or spray generously with oil.',
            ingredients: [
              {
                id: 4582,
                name: 'cooking oil',
                image: 'vegetable-oil.jpg',
              },
            ],
            equipment: [
              {
                id: 404671,
                name: 'muffin tray',
                image: 'muffin-tray.jpg',
              },
            ],
          },
          {
            number: 10,
            step: 'Fill each cup almost to the top and bake 16-20 minutes, or until a toothpick inserted in the middle of muffin comes out clean.',
            ingredients: [],
            equipment: [
              {
                id: 404644,
                name: 'toothpicks',
                image: 'toothpicks.jpg',
              },
              {
                id: 404784,
                name: 'oven',
                image: 'oven.jpg',
              },
            ],
          },
        ],
      },
      {
        name: 'Lets make the ganache icing',
        steps: [
          {
            number: 1,
            step: 'Place chocolate chips and instant coffee in a medium sized bowl.',
            ingredients: [
              {
                id: 99278,
                name: 'chocolate chips',
                image: 'chocolate-chips.jpg',
              },
              {
                id: 14214,
                name: 'instant coffee',
                image: 'instant-coffee-or-instant-espresso.png',
              },
            ],
            equipment: [
              {
                id: 404783,
                name: 'bowl',
                image: 'bowl.jpg',
              },
            ],
          },
          {
            number: 2,
            step: 'Heat the creamer over medium heat until it reaches a gentle boil.',
            ingredients: [
              {
                id: 0,
                name: 'coffee creamer',
                image: '',
              },
            ],
            equipment: [],
          },
          {
            number: 3,
            step: 'Pour the warm creamer over the chocolate and coffee, whisk until smooth.',
            ingredients: [
              {
                id: 19081,
                name: 'chocolate',
                image: 'milk-chocolate.jpg',
              },
              {
                id: 0,
                name: 'coffee creamer',
                image: '',
              },
              {
                id: 14209,
                name: 'coffee',
                image: 'brewed-coffee.jpg',
              },
            ],
            equipment: [
              {
                id: 404661,
                name: 'whisk',
                image: 'whisk.png',
              },
            ],
          },
          {
            number: 4,
            step: 'Dip the top of the cupcakes in the ganache and place in refrigerator until set- 30-60 minutes.',
            ingredients: [
              {
                id: 18139,
                name: 'cupcakes',
                image: 'plain-cupcake.jpg',
              },
              {
                id: 0,
                name: 'dip',
                image: '',
              },
            ],
            equipment: [],
          },
        ],
      },
    ],
  };
}

export const mockRecipe = MockRecipes.chocolateCupcake;
