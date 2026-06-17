import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "./context/ThemeContext";
import AuthProvider from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllFacilities from "./pages/AllFacilities";
import FacilityDetails from "./pages/FacilityDetails";
import AddFacility from "./pages/AddFacility";
import ManageFacilities from "./pages/ManageFacilities";
import MyBookings from "./pages/MyBookings";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/facilities" element={<AllFacilities />} />
                <Route
                  path="/facility/:id"
                  element={
                    <PrivateRoute>
                      <FacilityDetails />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/add-facility"
                  element={
                    <PrivateRoute>
                      <AddFacility />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/manage-facilities"
                  element={
                    <PrivateRoute>
                      <ManageFacilities />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <PrivateRoute>
                      <MyBookings />
                    </PrivateRoute>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
