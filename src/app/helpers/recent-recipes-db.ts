import Dexie, { Table } from 'dexie';

import { RecipeWithTimestamp } from '../models/recipe.model';
import Constants from '../constants/constants';

class RecentRecipesDB extends Dexie {
  recipes!: Table<RecipeWithTimestamp, number>;

  constructor() {
    const { name, version, indexes } = Constants.recentRecipesDB;
    super(name);

    this.version(version).stores({
      recipes: Object.values(indexes).join(', '),
    });
    // No need to populate since recipes will stay in memory for now
  }
}

export default new RecentRecipesDB();
