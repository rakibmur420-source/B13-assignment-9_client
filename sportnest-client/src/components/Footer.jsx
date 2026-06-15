import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Logo & About */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="text-green-400 text-2xl">⚽</span>
            <span className="text-xl font-bold text-white">
              Sport<span className="text-green-400">Nest</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            SportNest is your ultimate sports facility booking platform. 
            Find and book football turfs, badminton courts, swimming lanes, 
            and tennis courts with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
            <li><Link to="/facilities" className="hover:text-green-400 transition">All Facilities</Link></li>
            <li><Link to="/my-bookings" className="hover:text-green-400 transition">My Bookings</Link></li>
            <li><Link to="/add-facility" className="hover:text-green-400 transition">Add Facility</Link></li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📍 Dhaka, Bangladesh</li>
            <li>📞 +880 1234-567890</li>
            <li>✉️ support@sportnest.com</li>
          </ul>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-gray-400 hover:text-green-400 transition text-xl"><FaFacebook /></a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition text-xl"><FaTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition text-xl"><FaInstagram /></a>
            <a href="#" className="text-gray-400 hover:text-green-400 transition text-xl"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} SportNest. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;