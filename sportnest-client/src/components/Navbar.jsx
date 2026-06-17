import useTheme from "../hooks/theme-hook";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gray-900 dark:bg-black text-white sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-green-400 text-2xl">⚽</span>
          <span className="text-xl font-bold text-white">
            Sport<span className="text-green-400">Nest</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-green-400 transition">Home</Link>
          <Link to="/facilities" className="hover:text-green-400 transition">All Facilities</Link>
          {user && (
            <>
              <Link to="/add-facility" className="hover:text-green-400 transition">Add Facility</Link>
              <Link to="/manage-facilities" className="hover:text-green-400 transition">Manage Facilities</Link>
              <Link to="/my-bookings" className="hover:text-green-400 transition">My Bookings</Link>
            </>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="text-xl hover:scale-110 transition"
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          {user ? (
            <div className="relative group">
              <img
                src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                alt="profile"
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-green-400"
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-lg hidden group-hover:block">
                <div className="px-4 py-2 border-b dark:border-gray-700">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <Link to="/my-bookings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">My Bookings</Link>
                <Link to="/add-facility" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Add Facility</Link>
                <Link to="/manage-facilities" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Manage Facilities</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-xl hover:scale-110 transition"
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            className="text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-800 dark:bg-gray-950 px-4 py-3 flex flex-col gap-3 overflow-hidden"
          >
            <Link to="/" className="hover:text-green-400" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/facilities" className="hover:text-green-400" onClick={() => setMenuOpen(false)}>All Facilities</Link>
            {user && (
              <>
                <Link to="/add-facility" className="hover:text-green-400" onClick={() => setMenuOpen(false)}>Add Facility</Link>
                <Link to="/manage-facilities" className="hover:text-green-400" onClick={() => setMenuOpen(false)}>Manage Facilities</Link>
                <Link to="/my-bookings" className="hover:text-green-400" onClick={() => setMenuOpen(false)}>My Bookings</Link>
                <button onClick={handleLogout} className="text-left text-red-400">Logout</button>
              </>
            )}
            {!user && (
              <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded-lg text-center" onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;