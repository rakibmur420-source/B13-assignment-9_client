import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { auth, googleProvider } from "../firebase.config";
import { signInWithPopup, signOut } from "firebase/auth";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("sportnest-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading] = useState(false);

  const register = async (name, email, password, photoURL) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name, email, password, photoURL,
    });
    return response.data;
  };

  const login = async (email, password) => {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    const { user: userData, token } = response.data;
    setUser(userData);
    if (token) localStorage.setItem("sportnest-token", token);
    return response.data;
  };

  const googleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;

    const response = await axios.post(
      `${API_URL}/auth/google`,
      { name: displayName, email, photoURL },
      { withCredentials: true }
    );
    const { user: userData, token } = response.data;
    setUser(userData);
    if (token) localStorage.setItem("sportnest-token", token);
    return response.data;
  };

  const logout = async () => {
    await signOut(auth);
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    setUser(null);
    localStorage.removeItem("sportnest-user");
    localStorage.removeItem("sportnest-token");
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("sportnest-user", JSON.stringify(user));
    }
  }, [user]);

  const authInfo = {
    user, setUser, loading, register, login, googleLogin, logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
