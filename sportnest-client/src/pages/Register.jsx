import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Register = () => {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoURL: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters!";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter!";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter!";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePassword(formData.password);
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.photoURL
      );
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      if (error.code === "auth/unauthorized-domain") {
        toast.error("This domain isn't authorized in Firebase yet.");
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.error("Google sign-in popup was closed.");
      } else {
        toast.error(error.response?.data?.message || "Google login failed!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center gap-2 mb-4">
            <span className="text-green-400 text-3xl">⚽</span>
            <span className="text-2xl font-bold text-gray-800 dark:text-white">
              Sport<span className="text-green-500">Nest</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Join SportNest and start booking!</p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Photo URL
              </label>
              <input
                type="url"
                name="photoURL"
                value={formData.photoURL}
                onChange={handleChange}
                placeholder="Enter your photo URL"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 chars, uppercase & lowercase"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                required
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Must contain at least 6 characters, one uppercase and one lowercase letter.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span className="text-gray-400 dark:text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="w-full border-2 border-gray-200 dark:border-gray-700 hover:border-green-400 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-3"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="google"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
          </div>

          <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-500 font-semibold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
