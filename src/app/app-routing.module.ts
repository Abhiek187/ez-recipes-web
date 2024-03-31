import { Injectable, NgModule } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Route,
  RouterModule,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RecipeComponent } from './components/recipe/recipe.component';
import { SearchComponent } from './components/search/search.component';

export const routes: Record<string, Route> = {
  recipe: { path: 'recipe/:id', component: RecipeComponent },
  search: { path: 'search', title: 'Search', component: SearchComponent },
  // The default route should be listed between the static routes and wildcard routes
  home: { path: '', title: 'Home', component: HomeComponent },
  // Show a 404 page for any other route
  notFound: {
    path: '**',
    title: 'Page Not Found',
    component: PageNotFoundComponent,
  },
};

@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    // Prepend the title for each page with the app name
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`EZ Recipes | ${title}`);
    }
  }
}

@NgModule({
  imports: [RouterModule.forRoot(Object.values(routes))],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: TemplatePageTitleStrategy }],
})
export class AppRoutingModule {}
