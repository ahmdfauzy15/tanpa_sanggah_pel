import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  BarChart3,
  TrendingUp,
  History,
  ArrowRight,
  Search,
  AlertCircle,
  Building,
  Calendar,
  XCircle,
  Key,
  User
} from 'lucide-react';
import WelcomeBanner from '../components/dashboard/WelcomeBanner';
import StatsCard from '../components/dashboard/StatsCard';
import QuickAccessCard from '../components/dashboard/QuickAccessCard';
import ActivityList from '../components/dashboard/ActivityList';
import RecentReports from '../components/dashboard/RecentReports';
import DashboardCarousel from '../components/dashboard/DashboardCarousel';
import { Link } from 'react-router-dom'; // TAMBAHKAN INI
import { 
  homeReportsData, 
  welcomeStats, 
  quickAccessCards, 
  recentActivityData,
  getRealTimeStats,
  processReportData 
} from '../data/reportDataDash';

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ambil data real-time
  const realTimeStats = getRealTimeStats();
  const processedData = processReportData();
  
  // Hitung statistik tambahan
  const totalLJKTypes = Object.keys(processedData.reportsByLJKType).length;
  // const uniquePeriods = Object.keys(processedData.reportsByPeriod).length;
  
  // Data aktivitas berdasarkan JSON
  const activityData = recentActivityData;
  
  return (
    <div className="space-y-6 animate-fade-in bg-gradient-to-br from-red-50/30 to-white min-h-screen p-4 lg:p-6">
      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* Dashboard Carousel */}
      <DashboardCarousel />

      {/* Stats Overview */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {welcomeStats.map((stat, index) => (
          <StatsCard
            key={index}
            number={stat.number}
            label={stat.label}
            icon={stat.icon}
            color={stat.color}
            trend="up"
          />
        ))}
      </div> */}

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {quickAccessCards.map((card, index) => (
          <QuickAccessCard
            key={index}
            title={card.title}
            description={card.description}
            reports={card.reports}
            color={card.color}
            link={card.link}     
          />
        ))}
        
        {/* Tambahkan card untuk Access Management */}
        <Link to="/Profile">
          <div className="bg-gradient-to-br from-red-50/30 to-white border border-red-100 hover:border-red-300 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer h-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow group-hover:scale-110 transition-transform duration-300">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    Baru
                  </span>
                </div>
              </div>
              
              <h4 className="text-lg font-bold text-red-900 mb-2">Management Account</h4>
              <p className="text-red-600 text-sm mb-4">
                Kelola hak akses dan profil pengguna aplikasi pelaporan OJK
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Akses Aktif</span>
                  <span className="font-bold text-red-700">3</span>
                </div>
                {/* <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status Akun</span>
                  <span className="font-medium text-green-600">Aktif</span>
                </div> */}
              </div>
              
              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm font-medium text-red-600 group-hover:text-red-700 transition-colors">
                  Profile Pengguna
                </span>
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center text-white group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity and Reports */}
      <div className="space-y-6">
       

        {/* Recent Reports - Chart Version */}
      
      </div>

      {/* Additional Dashboard Info */}
      {/* <div className="mt-8 p-6 bg-gradient-to-r from-red-600 to-red-700 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-white">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <CheckCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Kepatuhan Pelaporan</h4>
            </div>
            <p className="text-red-100 text-sm">
              {realTimeStats.successRate}% laporan berhasil dikirim tepat waktu sesuai regulasi OJK.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Monitoring</h4>
            </div>
            <p className="text-red-100 text-sm">
              Pantau status {processedData.activeReports} laporan aktif dalam sistem IRS.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg">Analisis Data</h4>
            </div>
            <p className="text-red-100 text-sm">
              Analisis {processedData.totalReports} laporan dari 3 jenis aplikasi pelaporan untuk insight komprehensif.
            </p>
          </div>

          <div className="space-y-2">
  <div className="flex items-center space-x-3">
    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
      <User className="w-5 h-5" />
    </div>
    <h4 className="font-bold text-lg">Manajemen Akun</h4>
  </div>
  <p className="text-red-100 text-sm">
    Akses profil dan kelola role pengguna
  </p>
</div>
        </div>
      </div> */}

      {/* Sistem Info */}
      {/* <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Informasi Sistem</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">APOLO</span>
            </div>
            <p className="text-xs text-gray-600">
              {processedData.reportsBySystem.APOLO?.length || 0} laporan dari berbagai jenis LJK
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">E-Reporting</span>
            </div>
            <p className="text-xs text-gray-600">
              {processedData.reportsBySystem.Ereporting?.length || 0} laporan elektronik
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">SiPina</span>
            </div>
            <p className="text-xs text-gray-600">
              {processedData.reportsBySystem.SiPina?.length || 0} laporan nasabah asing
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Role & Access</span>
            </div>
            <p className="text-xs text-gray-600">
              <Link to="/AccessManagement" className="text-red-600 hover:text-red-700 hover:underline">
                Akses manajemen akun pengguna
              </Link>
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;