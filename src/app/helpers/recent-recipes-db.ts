import Dexie, { Table } from 'dexie';

import Recipe from '../models/recipe.model';
import Constants from '../constants/constants';

class RecentRecipesDB extends Dexie {
  recipes!: Table<Recipe, number>;

  constructor() {
    super(Constants.recentRecipesDB.name);
    this.version(Constants.recentRecipesDB.version).stores({
      // Primary key and indexes
      recipes: 'id',
    });
    // No need to populate since recipes will stay in memory for now
  }
}

export default new RecentRecipesDB();
