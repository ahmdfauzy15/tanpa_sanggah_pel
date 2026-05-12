// src/App.js

import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate
} from 'react-router-dom';

// ===== USER COMPONENTS =====
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import ApoloReports from './pages/ApoloReports';
import EReporting from './pages/EReporting';
import SIPINA from './pages/SIPINA';
import Notifications from './pages/Notifications';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import DownloadCenter from './components/dashboard/DownloadCenter';
import Korespondensi from './pages/Korespondensi';
import AccessManagement from './pages/AccessManagement';
import AIAssistant from './components/common/AIAssistant';
import AntiGratificationBanner from './components/common/AntiGratificationBanner';

// ===== ADMIN COMPONENTS =====
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminHeader from './components/layout/AdminHeader';
import AdminSidebar from './components/layout/AdminSidebar';
import AboutAdmin from './pages/admin/AboutAdmin';
import FAQAdmin from './pages/admin/FAQAdmin';
import FAQManagement from './pages/admin/FAQManagement'; 
import ProfilrAdm from './pages/admin/Profile'; 
import Adminset from './pages/admin/AdminSettings';

// ================= LAYOUTS =================

const UserLayout = ({ sidebarOpen, toggleSidebar }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <AntiGratificationBanner />
    
    <div className="flex min-h-screen">
      <Sidebar isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
    
    <AIAssistant />
  </div>
);

const AdminLayout = ({ sidebarOpen, toggleSidebar }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
    <AntiGratificationBanner />
    
    <div className="flex min-h-screen">
      <AdminSidebar isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
    
    <AIAssistant />
  </div>
);

// ================= APP =================

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      if (width >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <Routes>
        {/* ================= ROOT REDIRECT ================= */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* ================= USER ROUTES ================= */}
        <Route
          path="/"
          element={
            <UserLayout
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              windowWidth={windowWidth}
            />
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/absensi" element={<ApoloReports />} />
          <Route path="ereporting" element={<EReporting />} />
          <Route path="sipina" element={<SIPINA />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="profile/*" element={<Profile />} />
          
          {/* Rute untuk AccessManagement */}
          <Route path="access-management" element={<AccessManagement />} />
          <Route path="AccessManagement" element={<Navigate to="/access-management" replace />} />
          
          <Route path="settings" element={<Settings />} />
          <Route path="download" element={<DownloadCenter />} />
          <Route path="korespondensi/notifikasi" element={<Korespondensi />} />
          <Route path="korespondensi/pengumuman" element={<Korespondensi />} />
          
          {/* Redirect untuk home */}
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <AdminLayout
              sidebarOpen={sidebarOpen}
              toggleSidebar={toggleSidebar}
              windowWidth={windowWidth}
            />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="faq" element={<FAQManagement />} />
          <Route path="profileadm" element={<ProfilrAdm />} />
          <Route path="settings" element={<Adminset />} />

        </Route>

        {/* ================= FALLBACK ROUTE ================= */}
        <Route path="*" element={
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            <AntiGratificationBanner />
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
                <p className="text-gray-700 mb-6">Halaman tidak ditemukan</p>
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            </div>
          </div>
        } />

      </Routes>
    </Router>
  );
}

export default App;