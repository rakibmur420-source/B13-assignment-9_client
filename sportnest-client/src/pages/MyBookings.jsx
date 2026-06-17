import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import Loading from "../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/bookings/user/${user.email}`,
        { withCredentials: true }
      );
      setBookings(res.data);
    } catch {
      toast.error("Failed to fetch bookings!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`${API_URL}/bookings/${id}`, {
        withCredentials: true,
      });
      toast.success("Booking cancelled successfully!");
      fetchBookings();
    } catch {
      toast.error("Failed to cancel booking!");
    }
  };

  if (loading) {
    return <Loading />;
  }

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
            My <span className="text-green-500">Bookings</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and track all your facility bookings.
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📅</p>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">
              No Bookings Found!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              You have not made any bookings yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
              <thead className="bg-gray-800 dark:bg-gray-950 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Facility
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Time Slot
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Hours
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {booking.facility_name}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                      {booking.booking_date}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                      {booking.time_slot}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300 text-sm">
                      {booking.hours} hr
                    </td>
                    <td className="px-6 py-4 text-green-500 font-bold">
                      ৳{booking.total_price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === "pending"
                            ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"
                            : booking.status === "confirmed"
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Cancel
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
