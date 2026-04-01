import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import VehicleDetail from './pages/VehicleDetail';
import Appointment from './pages/Appointment';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import VehicleForm from './pages/admin/VehicleForm';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<><Navbar /><Home /><Footer /><WhatsAppFloat /></>} />
        <Route path="/catalogue" element={<><Navbar /><Catalogue /><Footer /><WhatsAppFloat /></>} />
        <Route path="/vehicule/:id" element={<><Navbar /><VehicleDetail /><Footer /><WhatsAppFloat /></>} />
        <Route path="/rendez-vous" element={<><Navbar /><Appointment /><Footer /><WhatsAppFloat /></>} />

        {/* Routes admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/vehicule/nouveau" element={<PrivateRoute><VehicleForm /></PrivateRoute>} />
        <Route path="/admin/vehicule/:id" element={<PrivateRoute><VehicleForm /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
