import Dexie, { Table } from 'dexie';

import { RecentRecipe } from '../models/recipe.model';
import Constants from '../constants/constants';

class RecentRecipesDB extends Dexie {
  recipes!: Table<RecentRecipe, number>;

  constructor() {
    const { name, config } = Constants.recentRecipesDB;
    super(name);

    for (const { version, indexes, upgrade } of config) {
      this.version(version).stores({
        recipes: Object.values(indexes).join(', '),
      });
      if (upgrade !== undefined) {
        this.version(version).upgrade((tx) =>
          tx.table<RecentRecipe>(name).toCollection().modify(upgrade)
        );
      }
    }
    // No need to populate since recipes will stay in memory for now
  }
}

export default new RecentRecipesDB();
