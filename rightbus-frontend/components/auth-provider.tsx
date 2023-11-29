"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthContext, { AuthContextValue } from "./auth-context";
import { AuthContextInitialState, AuthContextState } from "@/types";

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie?.split("; ");

  if (!cookies) {
    return null;
  }

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const [cookieName, cookieValue] = cookie.split("=");

    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }

  return null;
};

export const setCookie = (
  name: string,
  value: string,
  expiresInDays: number
): void => {
  const date = new Date();
  date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  const expires = date.toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=/`;
};

const AuthProvider = ({ children }: any) => {
  const [state, setState] = useState<AuthContextState>(AuthContextInitialState);

  useEffect(() => {
    // Check for any existing authentication session or saved user data
    const token = getCookie("token");
    if (token) {
      axios
        .get("http://localhost:3000/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            const user = response.data;
            setState((prevState) => ({
              ...prevState,
              isLoggedIn: true,
              user,
              loading: false,
              error: null,
            }));
          } else {
            setCookie("token", "", -1);
            setState((prevState) => ({
              ...prevState,
              isLoggedIn: false,
              user: null,
              loading: false,
              error: "Invalid token",
            }));
          }
        })
        .catch((error) => {
          console.error(error);
          setState((prevState) => ({
            ...prevState,
            isLoggedIn: false,
            user: null,
            loading: false,
            error: "Failed to verify token",
          }));
        });
    }
  }, []);

  const logIn = (user: any) => {
    setState((prevState) => ({
      ...prevState,
      isLoggedIn: true,
      user,
      loading: false,
      error: null,
    }));
  };

  const logOut = () => {
    setCookie("token", "", -1);
    setState((prevState) => ({
      ...prevState,
      isLoggedIn: false,
      user: null,
      loading: false,
      error: null,
    }));
  };

  const handleLogin = (credentials: any) => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));

    axios
      .post("http://localhost:3000/api/auth/signin", credentials)
      .then((response) => {
        if (response.status === 200) {
          const token = response.data.token;
          setCookie("token", token, 10);

          axios
            .get("http://localhost:3000/api/auth/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const user = response.data;
              setState((prevState) => ({
                ...prevState,
                isLoggedIn: true,
                user,
                loading: false,
                error: null,
              }));
            })
            .catch((error) => {
              console.error(error);
              setState((prevState) => ({
                ...prevState,
                isLoggedIn: false,
                user: null,
                loading: false,
                error: "Failed to fetch user data",
              }));
            });
        } else {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            error: response.data.message,
          }));
        }
      })
      .catch((error) => {
        console.error(error);
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: "Failed to log in",
        }));
      });
  };

  const handleLogout = () => {
    // Send logout request to the server (if applicable)
    // axios
    //   .post("/api/logout")
    //   .then((response) => {
    //     if (response.status === 200) {
    //       logOut();
    //     } else {
    //       console.error("Failed to log out");
    //     }
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     console.log("Failed to log out");
    //   });
    logOut();
  };

  const contextValue: AuthContextValue = {
    state,
    logIn,
    logOut,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
