import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorsListing from './pages/Doctors';
import About from './pages/About';
import Contact from './pages/Contact';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';
import ManageDepartments from './pages/admin/ManageDepartments';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManagePayments from './pages/admin/ManagePayments';
import ManageInquiries from './pages/admin/ManageInquiries';
import Reports from './pages/admin/Reports';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import PatientPayments from './pages/patient/PatientPayments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/doctors" element={<DoctorsListing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute roles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/doctors" element={<ProtectedRoute roles={['Admin']}><ManageDoctors /></ProtectedRoute>} />
            <Route path="/admin/patients" element={<ProtectedRoute roles={['Admin']}><ManagePatients /></ProtectedRoute>} />
            <Route path="/admin/departments" element={<ProtectedRoute roles={['Admin']}><ManageDepartments /></ProtectedRoute>} />
            <Route path="/admin/appointments" element={<ProtectedRoute roles={['Admin']}><ManageAppointments /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute roles={['Admin']}><ManagePayments /></ProtectedRoute>} />
            <Route path="/admin/inquiries" element={<ProtectedRoute roles={['Admin']}><ManageInquiries /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute roles={['Admin']}><Reports /></ProtectedRoute>} />

            {/* Doctor Routes */}
            <Route path="/doctor" element={<ProtectedRoute roles={['Doctor']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/appointments" element={<ProtectedRoute roles={['Doctor']}><DoctorAppointments /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute roles={['Doctor']}><DoctorProfile /></ProtectedRoute>} />

            {/* Patient Routes */}
            <Route path="/patient" element={<ProtectedRoute roles={['Patient']}><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patient/profile" element={<ProtectedRoute roles={['Patient']}><PatientProfile /></ProtectedRoute>} />
            <Route path="/patient/book" element={<ProtectedRoute roles={['Patient']}><BookAppointment /></ProtectedRoute>} />
            <Route path="/patient/appointments" element={<ProtectedRoute roles={['Patient']}><MyAppointments /></ProtectedRoute>} />
            <Route path="/patient/payments" element={<ProtectedRoute roles={['Patient']}><PatientPayments /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
