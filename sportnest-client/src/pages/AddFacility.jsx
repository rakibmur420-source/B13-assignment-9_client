import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";
import { FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";

const AddFacility = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [slotInput, setSlotInput] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    facility_type: "",
    image: "",
    location: "",
    price_per_hour: "",
    capacity: "",
    available_slots: [],
    description: "",
  });

  const sportTypes = [
    "Football",
    "Badminton",
    "Swimming",
    "Tennis",
    "Cricket",
    "Basketball",
    "Volleyball",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSlot = () => {
    const trimmed = slotInput.trim();
    if (!trimmed) return;
    if (formData.available_slots.includes(trimmed)) {
      toast.error("Slot already added!");
      return;
    }
    setFormData({
      ...formData,
      available_slots: [...formData.available_slots, trimmed],
    });
    setSlotInput("");
  };

  const handleRemoveSlot = (slot) => {
    setFormData({
      ...formData,
      available_slots: formData.available_slots.filter((s) => s !== slot),
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    const imageData = new FormData();
    imageData.append("image", file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        imageData
      );
      setFormData({ ...formData, image: res.data.data.url });
      toast.success("Image uploaded successfully!");
    } catch {
      toast.error("Image upload failed!");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload an image!");
      return;
    }
    if (formData.available_slots.length === 0) {
      toast.error("Please add at least one time slot!");
      return;
    }
    setLoading(true);
    try {
      await axiosSecure.post(
        `/facilities`,
        { ...formData, owner_email: user.email }
      );
      toast.success("Facility added successfully! 🎉");
      navigate("/manage-facilities");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add facility!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Add <span className="text-green-500">Facility</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            List your sports venue for others to book
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name & Sport Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                  Facility Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Green Turf Football Ground"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                  Sport Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="facility_type"
                  value={formData.facility_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  required
                >
                  <option value="">Select sport type</option>
                  {sportTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                Facility Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
              />
              {imageUploading && (
                <p className="text-green-500 text-sm mt-1 animate-pulse">Uploading image...</p>
              )}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-lg mt-2 border border-green-300"
                />
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Gulshan, Dhaka"
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                required
              />
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                  Price/Hr ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price_per_hour"
                  value={formData.price_per_hour}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  min="1"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                  Capacity (Players) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g. 22"
                  min="1"
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                  required
                />
              </div>
            </div>

            {/* Available Time Slots */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                Available Time Slots <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={slotInput}
                  onChange={(e) => setSlotInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSlot())}
                  placeholder="e.g. 09:00 AM - 10:00 AM"
                  className="flex-1 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition"
                >
                  <FaPlusCircle className="text-xl" />
                </button>
              </div>
              {formData.available_slots.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.available_slots.map((slot) => (
                    <span
                      key={slot}
                      className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs px-3 py-1.5 rounded-full"
                    >
                      {slot}
                      <button type="button" onClick={() => handleRemoveSlot(slot)}>
                        <FaTimesCircle className="text-green-600 dark:text-green-400 hover:text-red-500 transition ml-1" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your facility..."
                rows={4}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition resize-none bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100"
                required
              />
            </div>

            {/* Owner Email (readonly) */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || imageUploading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 text-lg"
            >
              {loading ? "Adding Facility..." : "Add Facility"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFacility;
