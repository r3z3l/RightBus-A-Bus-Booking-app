export interface AuthContextState {
  isLoggedIn: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

export const AuthContextInitialState: AuthContextState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
};
