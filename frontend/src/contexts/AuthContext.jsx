import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || ""
  );

  // If there's a token but no user in context (e.g., page refresh), try to fetch profile
  useEffect(() => {
    const fetchUser = async () => {
      if (token && !user) {
        try {
          const res = await api.get("/users/profile");
          // API returns user object (userRoutes GET /profile)
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          console.error("Failed to fetch user profile in AuthProvider:", err);
          // If token invalid, clear it
          setToken("");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };

    fetchUser();
  }, [token]);

<<<<<<< HEAD
  const login = (jwt, rToken, userData) => {
=======
  const login = (jwt, userData) => {
>>>>>>> ce8b15b65b3aa3e65ac046be144aff8054f90225
    setToken(jwt);
    setRefreshToken(rToken);
    setUser(userData);
    localStorage.setItem("token", jwt);
    localStorage.setItem("refreshToken", rToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    // Try to revoke refresh token on server
    const rt = localStorage.getItem("refreshToken");
    if (rt) {
      try {
        api.post("/auth/logout", { refreshToken: rt }).catch(() => {});
      } catch (e) {}
    }

    setToken("");
    setRefreshToken("");
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
