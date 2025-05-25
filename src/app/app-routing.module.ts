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
import { RecipeComponent } from './components/recipe/recipe.component';
import { authGuard } from './guards/auth.guard';
import {
  LoginComponent,
  SignUpComponent,
  ForgotPasswordComponent,
  VerifyEmailComponent,
  UpdateEmailComponent,
  UpdatePasswordComponent,
  DeleteAccountComponent,
} from './components/profile';

export const profileRoutes: Record<string, Route> = {
  login: {
    path: 'login',
    title: 'Login',
    component: LoginComponent,
  },
  signUp: {
    path: 'sign-up',
    title: 'Sign Up',
    component: SignUpComponent,
  },
  forgotPassword: {
    path: 'forgot-password',
    title: 'Forgot Password',
    component: ForgotPasswordComponent,
  },
  verifyEmail: {
    path: 'verify-email',
    title: 'Verify Email',
    component: VerifyEmailComponent,
  },
  updateEmail: {
    path: 'update-email',
    title: 'Update Email',
    component: UpdateEmailComponent,
    canActivate: [authGuard],
  },
  updatePassword: {
    path: 'update-password',
    title: 'Update Password',
    component: UpdatePasswordComponent,
    canActivate: [authGuard],
  },
  deleteAccount: {
    path: 'delete-account',
    title: 'Delete Account',
    component: DeleteAccountComponent,
    canActivate: [authGuard],
  },
};

export const routes: Record<string, Route> = {
  recipe: { path: 'recipe/:id', component: RecipeComponent },
  search: {
    path: 'search',
    title: 'Search',
    loadComponent: () =>
      import('./components/search/search.component').then(
        (mod) => mod.SearchComponent
      ),
  },
  glossary: {
    path: 'glossary',
    title: 'Glossary',
    loadComponent: () =>
      import('./components/glossary/glossary.component').then(
        (mod) => mod.GlossaryComponent
      ),
  },
  profile: {
    path: 'profile',
    title: 'Profile',
    loadComponent: () =>
      import('./components/profile/profile.component').then(
        (mod) => mod.ProfileComponent
      ),
    children: Object.values(profileRoutes),
  },
  login: {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (mod) => mod.LoginComponent
      ),
  },
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
