import type { User } from "./user.types";

export type CurrentUser = User;

export interface AuthSession {
  accessToken: string;
  user: CurrentUser;
}

export interface AccessTokenResponse {
  accessToken: string;
}

export interface ConnectedAccount {
  provider: "google" | "github";
  connected: boolean;
  email: string | null;
}

export interface ConnectedAccounts {
  providers: ConnectedAccount[];
  hasPassword: boolean;
}
