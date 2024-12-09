import React from 'react';
import { Routes, Route, useLocation, Navigate, BrowserRouter } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Layout from './Layout/Layout';
import AdminLayout from './pages/Admin/components/AdminLayout';
import ClientLayout from './pages/Client/components/ClientLayout';
import EmailVerification from './pages/EmailVerification';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Footer from './components/Footer';

import ClientDashboard from './pages/Client/ClientDashboard';
import Requestss from './pages/Client/Requestss';
import Projects from './pages/Client/Projects';
import Report from './pages/Client/Report';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Project from './pages/Admin/Project';
import Requests from './pages/Admin/Requests';
// import Projects from './pages/Admin/Projects';
// import Services from './pages/Admin/Services';
// import Clients from './pages/Admin/Clients';
// import Technicians from './pages/Admin/Technicians';
// import Reports from './pages/Admin/Reports';
// import Messages from './pages/Admin/Messages';
// import Account from './pages/Admin/Account';
// import Settings from './pages/Admin/Settings';

import { ToastContainer, toast } from 'react-toastify';
import axiosInstance from './utils/axiosConfig';
import 'react-toastify/dist/ReactToastify.css';

const ScrollToSection = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);
  return null;
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  const location = useLocation();
  const hideFooterPaths = ['/signup', '/verify-email', '/login', '/admin/dashboard', '/admin/projects', '/admin/requests', '/client-dashboard', '/technician-dashboard', '/client-dashboard/requests', 'client-dashboard/projects', '/client-dashboard/reports', '/client-dashboard/projects'];
  const hideLayoutPaths = ['/admin/dashboard', '/admin/projects', '/admin/requests', '/client-dashboard', '/technician-dashboard', '/client-dashboard/requests', '/client-dashboard/projects', '/client-dashboard/reports'];

  return (
    <div className="app">
      {!hideLayoutPaths.includes(location.pathname) && <Layout />}
      
      <Routes>
        {/* User Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/" element={<Home />} />

        {/* Client Dashboard Routes */}
        <Route element={<ClientLayout />}>
          <Route
            path="/client-dashboard"
            element={<ClientDashboard />}
          />
          <Route
            path="/client-dashboard/requests"
            element={<Requestss />}
          />
          <Route
            path="/client-dashboard/projects"
            element={<Projects />}
          />
          <Route
            path="/client-dashboard/reports"
            element={<Report />}
          />
          {/* Add other client routes here */}
        </Route>
        
        {/* Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<Project />} />
          <Route path="/admin/requests" element={<Requests />} />
          {/* <Route path="/admin/projects" element={<Projects />} />
          <Route path="/admin/services" element={<Services />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/technicians" element={<Technicians />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/account" element={<Account />} />
          <Route path="/admin/settings" element={<Settings />} /> */}
        </Route>
      </Routes>
      
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
      
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

// Create a wrapper component that includes BrowserRouter
const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;