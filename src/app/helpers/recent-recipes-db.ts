import { inject, Injectable, InjectionToken } from '@angular/core';
import Dexie, { Table } from 'dexie';

import { RecentRecipe } from '../models/recipe.model';
import Constants from '../constants/constants';

export const RECENT_RECIPES_DB_NAME = new InjectionToken<string>('DB_NAME', {
  providedIn: 'root',
  factory: () => Constants.recentRecipesDB.dbName,
});

@Injectable({
  providedIn: 'root',
})
export default class RecentRecipesDB extends Dexie {
  recipes!: Table<RecentRecipe, number>;

  constructor() {
    const dbName = inject(RECENT_RECIPES_DB_NAME);
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
