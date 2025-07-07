export enum AuthState {
  Unauthenticated,
  Authenticated,
  Loading,
}

export interface Chef {
  uid: string;
  email: string;
  emailVerified: boolean;
  ratings: Record<string, number>;
  recentRecipes: Record<string, string>;
  favoriteRecipes: string[];
  token: string;
}

export interface ChefEmailResponse {
  kind: string;
  email: string;
  token?: string;
}

export interface ChefUpdate {
  type: ChefUpdateType;
  email: string;
  password?: string;
}

export enum ChefUpdateType {
  Email = 'email',
  Password = 'password',
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  uid: string;
  token: string;
  emailVerified: boolean;
}

export enum ProfileAction {
  VerifyEmail = 'verifyEmail',
  ChangeEmail = 'changeEmail',
  ResetPassword = 'resetPassword',
}
