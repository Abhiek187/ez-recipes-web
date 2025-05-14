export enum AuthState {
  Unauthenticated,
  Authenticated,
  Loading,
}

export type Chef = {
  uid: string;
  email: string;
  emailVerified: boolean;
  ratings: Record<string, number>;
  recentRecipes: Record<string, string>;
  favoriteRecipes: string[];
  token: string;
};

export type ChefEmailResponse = {
  kind: string;
  email: string;
  token?: string;
};

export type ChefUpdate = {
  type: ChefUpdateType;
  email: string;
  password?: string;
};

export enum ChefUpdateType {
  Email = 'email',
  Password = 'password',
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  uid: string;
  token: string;
  emailVerified: boolean;
};

export enum ProfileAction {
  VerifyEmail = 'verifyEmail',
  ChangeEmail = 'changeEmail',
  ResetPassword = 'resetPassword',
}
