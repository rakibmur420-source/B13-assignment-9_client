import { motion } from "framer-motion";

const Loading = ({ fullScreen = true }) => {
  return (
    <div
      className={`flex flex-col justify-center items-center gap-4 ${
        fullScreen ? "min-h-screen" : "py-20"
      } bg-white dark:bg-gray-900`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full"
      ></motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 dark:text-gray-400 text-sm font-medium"
      >
        Loading SportNest...
      </motion.p>
    </div>
  );
};

export default Loading;
