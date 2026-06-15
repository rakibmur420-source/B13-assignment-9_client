import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import toast from "react-hot-toast";

const API_URL = "http://localhost:5000/api";

const ManageFacilities = () => {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFacility, setEditFacility] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchMyFacilities();
  }, []);

  const fetchMyFacilities = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/facilities/owner/${user.email}`,
        { withCredentials: true }
      );
      setFacilities(res.data);
    } catch (error) {
      toast.error("Failed to fetch facilities!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this facility?"
    );
    if (!confirm) return;
    try {
      await axios.delete(`${API_URL}/facilities/${id}`, {
        withCredentials: true,
      });
      toast.success("Facility deleted successfully!");
      fetchMyFacilities();
    } catch (error) {
      toast.error("Failed to delete facility!");
    }
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
    } catch (error) {
      toast.error("Failed to update facility!");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Manage My <span className="text-green-500">Facilities</span>
          </h1>
          <p className="text-gray-500">
            Update or remove your listed sports facilities.
          </p>
        </div>

        {facilities.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🏟️</p>
            <h3 className="text-xl font-bold text-gray-700">
              No Facilities Found!
            </h3>
            <p className="text-gray-500 mt-2">
              You have not added any facilities yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility) => (
              <div
                key={facility._id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
              >
                <img
                  src={facility.image}
                  alt={facility.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full w-fit font-medium">
                    {facility.facility_type}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mt-2">
                    {facility.name}
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    📍 {facility.location}
                  </p>
                  <p className="text-green-500 font-bold mt-1">
                    ৳{facility.price_per_hour}/hr
                  </p>
                  <div className="flex gap-3 mt-auto pt-4">
                    <button
                      onClick={() => setEditFacility(facility)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(facility._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Update Modal */}
        {editFacility && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Update Facility
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facility Name
                  </label>
                  <input
                    type="text"
                    value={editFacility.name}
                    onChange={(e) =>
                      setEditFacility({ ...editFacility, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editFacility.location}
                    onChange={(e) =>
                      setEditFacility({
                        ...editFacility,
                        location: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Per Hour (৳)
                  </label>
                  <input
                    type="number"
                    value={editFacility.price_per_hour}
                    onChange={(e) =>
                      setEditFacility({
                        ...editFacility,
                        price_per_hour: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    value={editFacility.capacity}
                    onChange={(e) =>
                      setEditFacility({
                        ...editFacility,
                        capacity: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={editFacility.description}
                    onChange={(e) =>
                      setEditFacility({
                        ...editFacility,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-green-500 transition resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleUpdate}
                    disabled={updateLoading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
                  >
                    {updateLoading ? "Updating..." : "Update Facility"}
                  </button>
                  <button
                    onClick={() => setEditFacility(null)}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageFacilities;