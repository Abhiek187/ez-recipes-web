export enum AuthState {
  Unauthenticated,
  Authenticated,
  Loading,
}

export interface Chef {
  uid: string;
  email: string;
  emailVerified: boolean;
  providerData: ProviderData[];
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

export enum Provider {
  Google = 'google.com',
  Facebook = 'facebook.com',
  GitHub = 'github.com',
}

export interface ProviderStyle {
  label: string;
  backgroundColor: string;
  contentColor: string;
  icon: string;
}

export interface ProviderData {
  displayName?: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  providerId: string; // password auth can appear here
  uid: string;
}

export interface AuthUrl {
  providerId: Provider;
  authUrl: string;
}

export interface OAuthRequest {
  code: string;
  providerId: Provider;
  redirectUrl: string;
}

export interface OAuthResponse {
  code: string;
  state: string;
}
