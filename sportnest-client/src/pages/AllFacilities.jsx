import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AllFacilities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const sportTypes = ["Football", "Badminton", "Swimming", "Tennis", "Cricket", "Basketball"];

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/facilities`, {
        params: { search, type },
      });
      setFacilities(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchFacilities();
    }, 300);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type]);

  const handleBookNow = (id) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/facility/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">
            All <span className="text-green-500">Facilities</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Browse and book from our wide range of sports facilities.
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by facility name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition md:w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <option value="">All Sports</option>
            {sportTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {(search || type) && (
            <button
              onClick={() => { setSearch(""); setType(""); }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Clear
            </button>
          )}
        </div>

        {/* Facilities Grid */}
        {loading ? (
          <Loading fullScreen={false} />
        ) : facilities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏟️</p>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">No Facilities Found!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {facilities.map((facility, index) => (
                <motion.div
                  key={facility._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col"
                >
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded-full w-fit font-medium">
                      {facility.facility_type}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mt-2">
                      {facility.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      📍 {facility.location}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                      👥 Capacity: {facility.capacity}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                      {facility.description}
                    </p>
                    <div className="flex justify-between items-center mt-auto pt-4">
                      <p className="text-green-500 font-bold text-lg">
                        ৳{facility.price_per_hour}/hr
                      </p>
                      <button
                        onClick={() => handleBookNow(facility._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllFacilities;
