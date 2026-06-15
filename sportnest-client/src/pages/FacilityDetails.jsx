import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

const FacilityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_date: "",
    time_slot: "",
    hours: 1,
  });

  useEffect(() => {
    axios.get(`${API_URL}/facilities/${id}`).then((res) => {
      setFacility(res.data);
      setLoading(false);
    });
  }, [id]);

  const totalPrice = facility
    ? facility.price_per_hour * formData.hours
    : 0;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!formData.booking_date || !formData.time_slot) {
      toast.error("Please fill all booking fields!");
      return;
    }
    setBookingLoading(true);
    try {
      await axios.post(
        `${API_URL}/bookings`,
        {
          facility_id: facility._id,
          facility_name: facility.name,
          user_email: user.email,
          booking_date: formData.booking_date,
          time_slot: formData.time_slot,
          hours: formData.hours,
          total_price: totalPrice,
          status: "pending",
        },
        { withCredentials: true }
      );
      toast.success("Booking confirmed successfully!");
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed!");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-xl">Facility not found!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Facility Info */}
          <div>
            <img
              src={facility.image}
              alt={facility.name}
              className="w-full h-72 object-cover rounded-2xl shadow-lg"
            />
            <div className="bg-white rounded-2xl shadow-md p-6 mt-6">
              <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                {facility.facility_type}
              </span>
              <h1 className="text-3xl font-bold text-gray-800 mt-3">
                {facility.name}
              </h1>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Location</p>
                  <p className="font-semibold text-gray-800">
                    📍 {facility.location}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Capacity</p>
                  <p className="font-semibold text-gray-800">
                    👥 {facility.capacity} people
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Price Per Hour</p>
                  <p className="font-semibold text-green-500">
                    ৳{facility.price_per_hour}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs">Bookings</p>
                  <p className="font-semibold text-gray-800">
                    🏆 {facility.booking_count} times booked
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-500 text-xs mb-1">Available Slots</p>
                <div className="flex flex-wrap gap-2">
                  {facility.available_slots.map((slot, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mt-4 leading-relaxed">
                {facility.description}
              </p>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Book This Facility
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Name
                  </label>
                  <input
                    type="text"
                    value={facility.name}
                    readOnly
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="booking_date"
                    value={formData.booking_date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Slot
                  </label>
                  <select
                    name="time_slot"
                    value={formData.time_slot}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                    required
                  >
                    <option value="">Select a time slot</option>
                    {facility.available_slots.map((slot, i) => (
                      <option key={i} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours
                  </label>
                  <input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    min="1"
                    max="8"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                  />
                </div>

                {/* Total Price */}
                <div className="bg-green-50 rounded-lg p-4 flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total Price:</span>
                  <span className="text-2xl font-bold text-green-500">
                    ৳{totalPrice}
                  </span>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 text-lg"
                >
                  {bookingLoading ? "Confirming..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityDetails;