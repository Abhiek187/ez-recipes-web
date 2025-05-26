import { Injectable, NgModule, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  Route,
  RouterModule,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SearchComponent } from './components/search/search.component';
import { GlossaryComponent } from './components/glossary/glossary.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { devGuard } from './guards/dev.guard';

// Child routes require router-outlet, but these routes are relative to the profile component
export const profileRoutes: Record<string, Route> = {
  login: {
    path: 'profile/login',
    title: 'Login',
    loadComponent: () =>
      import('./components/profile').then((mod) => mod.LoginComponent),
    canActivate: [devGuard],
  },
  signUp: {
    path: 'profile/sign-up',
    title: 'Sign Up',
    loadComponent: () =>
      import('./components/profile').then((mod) => mod.SignUpComponent),
    canActivate: [devGuard],
  },
  forgotPassword: {
    path: 'profile/forgot-password',
    title: 'Forgot Password',
    loadComponent: () =>
      import('./components/profile').then((mod) => mod.ForgotPasswordComponent),
    canActivate: [devGuard],
  },
  verifyEmail: {
    path: 'profile/verify-email',
    title: 'Verify Email',
    loadComponent: () =>
      import('./components/profile').then((mod) => mod.VerifyEmailComponent),
    canActivate: [devGuard],
  },
  updateEmail: {
    path: 'profile/update-email',
    title: 'Update Email',
    loadComponent: () =>
      import('./components/profile').then((mod) => mod.UpdateEmailComponent),
    canActivate: [devGuard, authGuard],
  },
  updatePassword: {
    path: 'profile/update-password',
    title: 'Update Password',
    loadComponent: () =>
      import('./components/profile').then((mod) => mod.UpdatePasswordComponent),
    canActivate: [devGuard, authGuard],
  },
  changePassword: {
    path: '.well-known/change-password',
    redirectTo: 'profile/update-password',
  },
  deleteAccount: {
    path: 'profile/delete-account',
    title: 'Delete Account',
    loadComponent: () =>
      import('./components/profile').then((mod) => mod.DeleteAccountComponent),
    canActivate: [devGuard, authGuard],
  },
};

export const routes: Record<string, Route> = {
  recipe: {
    path: 'recipe/:id',
    loadComponent: () =>
      import('./components/recipe/recipe.component').then(
        (mod) => mod.RecipeComponent
      ),
  },
  search: {
    path: 'search',
    title: 'Search',
    component: SearchComponent,
  },
  glossary: {
    path: 'glossary',
    title: 'Glossary',
    component: GlossaryComponent,
  },
  profile: {
    path: 'profile',
    title: 'Profile',
    component: ProfileComponent,
    canActivate: [devGuard],
  },
  ...profileRoutes,
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
  private readonly title = inject(Title);

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
