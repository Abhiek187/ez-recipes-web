import { ProviderStyle, Provider } from '../models/profile.model';
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
  static readonly noTokenFound = 'No token found';
  static readonly credentialTooOldError = 'CREDENTIAL_TOO_OLD_LOGIN_AGAIN';

  // APIs
  static readonly recipesPath = '/api/recipes';
  static readonly termsPath = '/api/terms';
  static readonly chefsPath = '/api/chefs';
  static readonly redirectUrl = `${window.location.origin}/oauth/callback`;

  static readonly emailCooldownSeconds = 30;
  static readonly passwordMinLength = 8;

  // Source: https://github.com/firebase/firebaseui-web/blob/main/packages/styles/src/base.css
  static readonly providerStyles: Record<Provider, ProviderStyle> = {
    [Provider.Google]: {
      label: 'Google',
      backgroundColor: '#fff',
      contentColor: '#757575',
      icon: 'google.svg',
    },
    [Provider.Facebook]: {
      label: 'Facebook',
      backgroundColor: '#1877f2',
      contentColor: '#fff',
      icon: 'facebook.svg',
    },
    [Provider.GitHub]: {
      label: 'GitHub',
      backgroundColor: '#24292e',
      contentColor: '#fff',
      icon: 'github.svg',
    },
  };

  static LocalStorage = class {
    static readonly terms = 'terms';
    static readonly token = 'token';
    static readonly theme = 'theme';
  };

  // IndexedDB
  static recentRecipesDB = {
    dbName: 'RecentRecipesDB',
    tableName: 'recipes',
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
