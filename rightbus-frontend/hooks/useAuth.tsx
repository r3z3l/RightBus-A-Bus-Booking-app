import AuthContext from "@/components/auth-context";
import { useContext } from "react";

const useAuth = () => {
  const { state, logIn, logOut, handleLogin, handleLogout } =
    useContext(AuthContext);

  return {
    state,
    logIn,
    logOut,
    handleLogin,
    handleLogout,
  };
};

export default useAuth;
