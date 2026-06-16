import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AddFacility = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
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
  ];

  const timeSlots = [
    "06:00 AM - 07:00 AM",
    "07:00 AM - 08:00 AM",
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM",
    "08:00 PM - 09:00 PM",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSlotChange = (slot) => {
    const slots = formData.available_slots.includes(slot)
      ? formData.available_slots.filter((s) => s !== slot)
      : [...formData.available_slots, slot];
    setFormData({ ...formData, available_slots: slots });
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
    } catch (error) {
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
      toast.error("Please select at least one time slot!");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/facilities`,
        { ...formData, owner_email: user.email },
        { withCredentials: true }
      );
      toast.success("Facility added successfully!");
      navigate("/manage-facilities");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add facility!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Add <span className="text-green-500">Facility</span>
          </h1>
          <p className="text-gray-500">
            List your sports facility and start accepting bookings.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="space-y-5">
            {/* Facility Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter facility name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                required
              />
            </div>

            {/* Facility Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility Type
              </label>
              <select
                name="facility_type"
                value={formData.facility_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
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

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facility Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
              />
              {imageUploading && (
                <p className="text-green-500 text-sm mt-1">Uploading image...</p>
              )}
              {formData.image && (
                <img
                  src={formData.image}
                  alt="preview"
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter facility location"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                required
              />
            </div>

            {/* Price & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Per Hour (৳)
                </label>
                <input
                  type="number"
                  name="price_per_hour"
                  value={formData.price_per_hour}
                  onChange={handleChange}
                  placeholder="Enter price"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Enter capacity"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                  required
                />
              </div>
            </div>

            {/* Available Time Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <label
                    key={slot}
                    className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${
                      formData.available_slots.includes(slot)
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.available_slots.includes(slot)}
                      onChange={() => handleSlotChange(slot)}
                      className="accent-green-500"
                    />
                    <span className="text-xs text-gray-700">{slot}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your facility..."
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition resize-none"
                required
              />
            </div>

            {/* Owner Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                value={user?.email}
                readOnly
                className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading || imageUploading}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 text-lg"
            >
              {loading ? "Adding Facility..." : "Add Facility"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFacility;