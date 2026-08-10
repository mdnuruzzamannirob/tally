export interface CurrentUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  theme?: "LIGHT" | "DARK" | "SYSTEM";
}

export interface AuthSession {
  accessToken: string;
  user: CurrentUser;
}
