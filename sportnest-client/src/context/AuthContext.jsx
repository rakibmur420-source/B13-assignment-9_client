import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const register = async (name, email, password, photoURL) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
      photoURL,
    });
    return response.data;
  };

  const login = async (email, password) => {
    const response = await axios.post(
      `${API_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    setUser(response.data.user);
    return response.data;
  };

  const googleLogin = async (userData) => {
    const response = await axios.post(
      `${API_URL}/auth/google`,
      userData,
      { withCredentials: true }
    );
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    await axios.post(
      `${API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("sportnest-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("sportnest-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("sportnest-user");
    }
  }, [user]);

  const authInfo = {
    user,
    setUser,
    loading,
    register,
    login,
    googleLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;