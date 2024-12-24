import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

interface AuthContextType {
  token: string | null;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const navigate = useNavigate(); 

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, { email, password });
      const { access_token } = response.data;

      if (access_token) {
        setToken(access_token); 
        localStorage.setItem("token", access_token); 
        navigate("/");
        return null; 
      } else {
        console.error("No access token received from the server.");
        return "Login failed: No access token received.";
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data.detail;
        if (error.response?.status === 400 && errorMessage === "Invalid email or password") {
          return "Invalid email or password. Please try again.";
        } else {
          return errorMessage || "An error occurred during login.";
        }
      } else {
        console.error("Unexpected error:", error);
        return "An unexpected error occurred.";
      }
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token"); 
    navigate("/login");
  };

  const value = { token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
