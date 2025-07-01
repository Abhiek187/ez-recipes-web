import Dexie, { Table } from 'dexie';

import { RecentRecipe } from '../models/recipe.model';
import Constants from '../constants/constants';

export default class RecentRecipesDB extends Dexie {
  recipes!: Table<RecentRecipe, number>;

  constructor(dbName = Constants.recentRecipesDB.dbName) {
    super(dbName);
    const { tableName, config } = Constants.recentRecipesDB;

    for (const { version, indexes, upgrade } of config) {
      this.version(version).stores({
        [tableName]: Object.values(indexes).join(', '),
      });
      if (upgrade !== undefined) {
        this.version(version).upgrade((tx) =>
          tx.table<RecentRecipe>(tableName).toCollection().modify(upgrade)
        );
      }
    }
    // No need to populate since recipes will stay in memory for now
  }
}
