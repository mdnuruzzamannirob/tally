import type { User } from "./user.types";

export type CurrentUser = User;

export interface AuthSession {
  accessToken: string;
  user: CurrentUser;
}
