import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-900 dark:bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.p
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
          className="text-9xl font-bold text-green-500"
        >
          404
        </motion.p>
        <h1 className="text-4xl font-bold text-white mt-4 mb-3">
          Page Not Found!
        </h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Oops! The page you are looking for does not exist. It might have been
          moved or deleted.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Back to Home
          </Link>
          <Link
            to="/facilities"
            className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition"
          >
            Explore Facilities
          </Link>
        </div>
        <div className="mt-12 text-8xl">🏟️</div>
      </motion.div>
    </div>
  );
};

export default NotFound;
