import type { Nullable } from "./common.types";

export type ThemePreference = "light" | "dark" | "system";
export type DefaultLandingPage = "dashboard" | "applications";

export interface User {
  id: string;
  name: Nullable<string>;
  email: string;
  emailVerified: boolean;
  hasPassword: boolean;
  providers: string[];
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: ThemePreference;
  defaultLandingPage: DefaultLandingPage;
  timeZone: string;
  notificationsEnabled: boolean;
}

export interface UpdateProfileInput {
  name: string;
}
