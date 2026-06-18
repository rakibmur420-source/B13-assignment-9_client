import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { FaEdit, FaTrash, FaPlusCircle, FaTimesCircle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const sportTypes = [
  "Football", "Badminton", "Swimming", "Tennis", "Cricket", "Basketball", "Volleyball",
];

const ManageFacilities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFacility, setEditFacility] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [slotInput, setSlotInput] = useState("");

  const fetchMyFacilities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/facilities/owner/${user.email}`,
        { withCredentials: true }
      );
      setFacilities(res.data);
    } catch {
      toast.error("Failed to fetch facilities!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyFacilities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this facility?");
    if (!confirmed) return;
    try {
      await axios.delete(`${API_URL}/facilities/${id}`, { withCredentials: true });
      toast.success("Facility deleted.");
      fetchMyFacilities();
    } catch {
      toast.error("Failed to delete facility!");
    }
  };

  const openEdit = (facility) => {
    setEditFacility({ ...facility });
    setSlotInput("");
  };

  const handleAddSlot = () => {
    const trimmed = slotInput.trim();
    if (!trimmed) return;
    if ((editFacility.available_slots || []).includes(trimmed)) {
      toast.error("Slot already added!");
      return;
    }
    setEditFacility({
      ...editFacility,
      available_slots: [...(editFacility.available_slots || []), trimmed],
    });
    setSlotInput("");
  };

  const handleRemoveSlot = (slot) => {
    setEditFacility({
      ...editFacility,
      available_slots: editFacility.available_slots.filter((s) => s !== slot),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await axios.put(
        `${API_URL}/facilities/${editFacility._id}`,
        editFacility,
        { withCredentials: true }
      );
      toast.success("Facility updated successfully!");
      setEditFacility(null);
      fetchMyFacilities();
    } catch {
      toast.error("Failed to update facility!");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Manage My <span className="text-green-500">Facilities</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Edit or remove your listed venues
            </p>
          </div>
          <button
            onClick={() => navigate("/add-facility")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
          >
            + Add New
          </button>
        </motion.div>

        {facilities.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
            <p className="text-5xl mb-4">🏟️</p>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">No Facilities Found!</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">You have not added any facilities yet.</p>
            <button
              onClick={() => navigate("/add-facility")}
              className="mt-5 bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              Add Your First Facility
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
            {facilities.map((facility, index) => (
              <motion.div
                key={facility._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex items-center gap-4 p-4 ${
                  index !== facilities.length - 1
                    ? "border-b border-gray-100 dark:border-gray-700"
                    : ""
                }`}
              >
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800 dark:text-white truncate">
                      {facility.name}
                    </h3>
                    <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-0.5 rounded-full font-medium uppercase">
                      {facility.facility_type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">📍 {facility.location}</p>
                    <p className="text-green-500 font-semibold text-sm">${facility.price_per_hour}/hr</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">👥 {facility.capacity} players</p>
                    <p className="text-blue-500 text-sm font-medium">{facility.booking_count || 0} Bookings</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(facility)}
                    className="flex items-center gap-1.5 text-blue-500 hover:text-blue-700 text-sm font-medium transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(facility._id)}
                    className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        <AnimatePresence>
          {editFacility && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.target === e.currentTarget && setEditFacility(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Facility</h2>
                  <button
                    onClick={() => setEditFacility(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="p-6 space-y-4">
                  {/* Facility Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Facility Name
                    </label>
                    <input
                      type="text"
                      value={editFacility.name}
                      onChange={(e) => setEditFacility({ ...editFacility, name: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                      required
                    />
                  </div>

                  {/* Sport Type */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Sport Type
                    </label>
                    <select
                      value={editFacility.facility_type}
                      onChange={(e) => setEditFacility({ ...editFacility, facility_type: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    >
                      {sportTypes.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={editFacility.image}
                      onChange={(e) => setEditFacility({ ...editFacility, image: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={editFacility.location}
                      onChange={(e) => setEditFacility({ ...editFacility, location: e.target.value })}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    />
                  </div>

                  {/* Price & Capacity */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                        Price/Hr ($)
                      </label>
                      <input
                        type="number"
                        value={editFacility.price_per_hour}
                        onChange={(e) => setEditFacility({ ...editFacility, price_per_hour: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                        Capacity
                      </label>
                      <input
                        type="number"
                        value={editFacility.capacity}
                        onChange={(e) => setEditFacility({ ...editFacility, capacity: e.target.value })}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  {/* Available Slots */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Available Slots
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={slotInput}
                        onChange={(e) => setSlotInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSlot())}
                        placeholder="e.g. 09:00 AM - 10:00 AM"
                        className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 text-sm"
                      />
                      <button
                        type="button"
                        onClick={handleAddSlot}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2.5 rounded-lg transition"
                      >
                        <FaPlusCircle />
                      </button>
                    </div>
                    {(editFacility.available_slots || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editFacility.available_slots.map((slot) => (
                          <span
                            key={slot}
                            className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-3 py-1.5 rounded-full"
                          >
                            {slot}
                            <button type="button" onClick={() => handleRemoveSlot(slot)}>
                              <FaTimesCircle className="hover:text-red-500 transition ml-1" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editFacility.description}
                      onChange={(e) => setEditFacility({ ...editFacility, description: e.target.value })}
                      rows={3}
                      className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-green-500 transition resize-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                    >
                      {updateLoading ? "Updating..." : "Update Facility"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFacility(null)}
                      className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 rounded-lg font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageFacilities;
