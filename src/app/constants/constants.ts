import { RecentRecipe } from '../models/recipe.model';

abstract class Constants {
  static readonly loadingMessages = [
    'Prepping the ingredients... 🍱',
    'Preheating the oven... ⏲️',
    'Going grocery shopping... 🛒',
    'Drying the meat... 🥩',
    'Chopping onions... 😭',
    'Dicing fruit... 🍎',
    'Steaming veggies... 🥗',
    'Applying condiments... 🧂',
    'Spicing things up... 🌶️',
    'Melting the butter... 🧈',
    'Mashing the potatoes... 🥔',
    'Fluffing some rice... 🍚',
    'Mixing things up... 🥘',
    'Shaking things up... 🍲',
  ];

  // APIs
  static readonly recipesPath = '/api/recipes';
  static readonly termsPath = '/api/terms';
  static readonly chefsPath = '/api/chefs';

  static LocalStorage = class {
    static readonly terms = 'terms';
  };

  // IndexedDB
  static recentRecipesDB = {
    name: 'RecentRecipesDB',
    max: 10,
    config: [
      {
        version: 1,
        // Primary key and indexes
        indexes: {
          id: 'id',
          timestamp: 'timestamp',
        },
      },
      {
        version: 2,
        indexes: {
          id: 'id',
          timestamp: 'timestamp',
          isFavorite: 'isFavorite',
        },
        upgrade: (recentRecipe: RecentRecipe) => {
          recentRecipe.isFavorite = false;
        },
      },
    ],
  };
}

export default Constants;
