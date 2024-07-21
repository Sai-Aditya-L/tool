import React, { createContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isInitialized: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (
    name: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isInitialized: false,
  loginUser: async () => {},
  registerUser: async () => {},
  logout: () => {},
  getToken: () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  const loginUser = async (email: string, password: string) => {
    // Placeholder for network call to authenticate
    const response = await fetch("http://127.0.0.1:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const { token } = data;
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", token);
    } else {
      throw new Error("Login failed");
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string,
  ) => {
    // Placeholder for network call to register
    const response = await fetch("http://127.0.0.1:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const { token } = data;
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", token);
    } else {
      throw new Error("Registration failed");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isInitialized,
        loginUser,
        registerUser,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
