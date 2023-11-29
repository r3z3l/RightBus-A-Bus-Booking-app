import { AuthContextInitialState, AuthContextState } from "@/types";
import { createContext } from "react";

export interface AuthContextValue {
  state: AuthContextState;
  logIn: (user: any) => void;
  logOut: () => void;
  handleLogin: (creadentials: any) => void;
  handleLogout: () => void;
}

export const AuthContextInitialStateValues: AuthContextValue = {
  state: AuthContextInitialState,
  logIn: (user: any) => {},
  logOut: () => {},
  handleLogin: (creadentials: any) => {},
  handleLogout: () => {},
};

const AuthContext = createContext<AuthContextValue>(
  AuthContextInitialStateValues
);

export default AuthContext;
