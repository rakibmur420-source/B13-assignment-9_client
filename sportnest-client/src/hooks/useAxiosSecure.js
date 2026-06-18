import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const axiosSecure = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
// Attach token from localStorage to every request
axiosSecure.interceptors.request.use((config) => {
  const token = localStorage.getItem("sportnest-token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

const useAxiosSecure = () => axiosSecure;

export default useAxiosSecure;
