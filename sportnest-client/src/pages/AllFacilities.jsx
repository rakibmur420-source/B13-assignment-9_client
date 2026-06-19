import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ITEMS_PER_PAGE = 6;

const AllFacilities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const sportTypes = ["Football", "Badminton", "Swimming", "Tennis", "Cricket", "Basketball", "Volleyball"];

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/facilities`, {
        params: { search, type },
      });
      setFacilities(res.data || []);
    } catch {
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchFacilities();
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(delay);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type]);

  const handleBookNow = (id) => {
    if (!user) return navigate("/login");
    navigate(`/facility/${id}`);
  };

  const displayedFacilities = [...facilities].sort((a, b) => {
    if (sortOrder === "asc") return a.price_per_hour - b.price_per_hour;
    if (sortOrder === "desc") return b.price_per_hour - a.price_per_hour;
    return 0;
  });

  const totalPages = Math.ceil(displayedFacilities.length / ITEMS_PER_PAGE);
  const paginatedFacilities = displayedFacilities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            All <span className="text-green-500">Facilities</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {loading
              ? "Browse our sports venues available for booking."
              : `Browse ${displayedFacilities.length} sports venue${displayedFacilities.length === 1 ? "" : "s"} available for booking`}
          </p>
        </motion.div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by facility name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-9 pr-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
            />
          </div>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setCurrentPage(1); }}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition md:w-48 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
          >
            <option value="">All Sports</option>
            {sportTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "" : "asc")}
            className={`px-4 py-3 rounded-lg font-medium transition border ${
              sortOrder === "asc"
                ? "bg-green-500 text-white border-green-500"
                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
            }`}
          >
            ↑ Price
          </button>
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "" : "desc")}
            className={`px-4 py-3 rounded-lg font-medium transition border ${
              sortOrder === "desc"
                ? "bg-green-500 text-white border-green-500"
                : "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800"
            }`}
          >
            ↓ Price
          </button>
          {(search || type || sortOrder) && (
            <button
              onClick={() => { setSearch(""); setType(""); setSortOrder(""); setCurrentPage(1); }}
              className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg font-medium transition"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* Facilities Grid */}
        {loading ? (
          <Loading fullScreen={false} />
        ) : paginatedFacilities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏟️</p>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">No Facilities Found!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Try a different search or filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {paginatedFacilities.map((facility, index) => (
                  <motion.div
                    key={facility._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col"
                  >
                    <div className="relative">
                      <img
                        src={facility.image}
                        alt={facility.name}
                        className="w-full h-48 object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                        {facility.facility_type}
                      </span>
                      <span className="absolute top-3 right-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        ${facility.price_per_hour}/hr
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        {facility.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                        📍 {facility.location}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1">
                        👥 Up to {facility.capacity} players
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-1">
                        🕒 {facility.available_slots?.length || 0} slots available
                      </p>
                      <div className="mt-auto pt-4">
                        <button
                          onClick={() => handleBookNow(facility._id)}
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                        >
                          Book Now →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-semibold transition ${
                      currentPage === page
                        ? "bg-green-500 text-white"
                        : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-green-500"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllFacilities;
