import useTheme from "../hooks/theme-hook";
import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import {
  FaCalendarAlt,
  FaPlusCircle,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully!");
    setProfileOpen(false);
    navigate("/login");
  };

  // Close profile dropdown when clicking outside it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-green-400 font-semibold"
        : "hover:text-green-400"
    }`;

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
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/facilities" className={navLinkClass}>All Facilities</NavLink>
          {user && (
            <>
              <NavLink to="/add-facility" className={navLinkClass}>Add Facility</NavLink>
              <NavLink to="/manage-facilities" className={navLinkClass}>Manage Facilities</NavLink>
              <NavLink to="/my-bookings" className={navLinkClass}>My Bookings</NavLink>
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
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 rounded-full pl-1 pr-3 py-1 transition"
              >
                <img
                  src={user.photoURL || "https://i.ibb.co/4pDNDk1/avatar.png"}
                  alt="profile"
                  className="w-8 h-8 rounded-full border-2 border-green-400"
                />
                <span className="text-sm max-w-[110px] truncate">
                  {user.name || user.email}
                </span>
                <FaChevronDown
                  className={`text-xs transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow-xl overflow-hidden border dark:border-gray-700"
                  >
                    <div className="px-4 py-3 border-b dark:border-gray-700">
                      <p className="text-xs text-gray-400 dark:text-gray-500">Signed in as</p>
                      <p className="font-semibold text-sm truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/my-bookings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      <FaCalendarAlt className="text-green-500" /> My Bookings
                    </Link>
                    <Link
                      to="/add-facility"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      <FaPlusCircle className="text-green-500" /> Add Facility
                    </Link>
                    <Link
                      to="/manage-facilities"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                    >
                      <FaCog className="text-green-500" /> Manage Facilities
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 text-sm text-red-500 border-t dark:border-gray-700"
                    >
                      <FaSignOutAlt /> Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
            <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/facilities" className={navLinkClass} onClick={() => setMenuOpen(false)}>All Facilities</NavLink>
            {user && (
              <>
                <NavLink to="/add-facility" className={navLinkClass} onClick={() => setMenuOpen(false)}>Add Facility</NavLink>
                <NavLink to="/manage-facilities" className={navLinkClass} onClick={() => setMenuOpen(false)}>Manage Facilities</NavLink>
                <NavLink to="/my-bookings" className={navLinkClass} onClick={() => setMenuOpen(false)}>My Bookings</NavLink>
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