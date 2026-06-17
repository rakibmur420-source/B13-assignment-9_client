import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const Home = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/facilities`).then((res) => {
      setFacilities(res.data.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Banner Section */}
      <section className="relative bg-gray-900 text-white min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1600')",
          }}
        ></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
              #1 Sports Booking Platform
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-6 leading-tight">
              Book Your <span className="text-green-400">Dream</span> Sports
              Facility
            </h1>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
              Discover and book top-quality sports facilities near you. From
              football turfs to badminton courts, swimming lanes to tennis
              courts — we have it all at your fingertips.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/facilities"
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
              >
                Explore Facilities
              </Link>
              <Link
                to="/register"
                className="border-2 border-white hover:border-green-400 hover:text-green-400 text-white px-8 py-3 rounded-lg font-semibold transition text-lg"
              >
                Get Started
              </Link>
            </div>
            {/* Stats */}
            <div className="flex gap-8 mt-12">
              <div>
                <p className="text-3xl font-bold text-green-400">500+</p>
                <p className="text-gray-400 text-sm">Facilities</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400">10k+</p>
                <p className="text-gray-400 text-sm">Bookings</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-400">50+</p>
                <p className="text-gray-400 text-sm">Cities</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Facilities */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Featured <span className="text-green-500">Facilities</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Explore our most popular sports facilities handpicked for the
              best experience.
            </p>
          </motion.div>

          {loading ? (
            <Loading fullScreen={false} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map((facility, index) => (
                <motion.div
                  key={facility._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
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
                    <div className="flex justify-between items-center mt-auto pt-4">
                      <p className="text-green-500 font-bold text-lg">
                        ৳{facility.price_per_hour}/hr
                      </p>
                      <Link
                        to={`/facility/${facility._id}`}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/facilities"
              className="border-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-8 py-3 rounded-lg font-semibold transition"
            >
              View All Facilities
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              How It <span className="text-green-500">Works</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Book your favorite sports facility in just 3 simple steps.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Find a Facility",
                desc: "Browse through hundreds of sports facilities near your location.",
              },
              {
                step: "02",
                icon: "📅",
                title: "Choose a Slot",
                desc: "Select your preferred date and time slot that suits your schedule.",
              },
              {
                step: "03",
                icon: "✅",
                title: "Confirm Booking",
                desc: "Complete your booking and get ready to play!",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center p-8 rounded-xl border-2 border-gray-100 dark:border-gray-800 hover:border-green-400 transition"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <span className="text-green-500 font-bold text-sm">
                  STEP {item.step}
                </span>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mt-2 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sports Categories Section */}
      <section className="py-16 bg-gray-900 dark:bg-black text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Sports <span className="text-green-400">Categories</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              We offer a wide range of sports facilities for every sport lover.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "⚽", name: "Football", count: "120+ Turfs" },
              { icon: "🏸", name: "Badminton", count: "80+ Courts" },
              { icon: "🏊", name: "Swimming", count: "40+ Lanes" },
              { icon: "🎾", name: "Tennis", count: "60+ Courts" },
            ].map((sport, index) => (
              <motion.div
                key={sport.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <Link
                  to="/facilities"
                  className="bg-gray-800 hover:bg-green-500 transition p-6 rounded-xl text-center group block"
                >
                  <div className="text-5xl mb-3">{sport.icon}</div>
                  <h3 className="font-bold text-lg">{sport.name}</h3>
                  <p className="text-gray-400 group-hover:text-white text-sm mt-1">
                    {sport.count}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
