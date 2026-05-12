import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Info, 
  Mail,
  Filter,
  Megaphone,
  Calendar,
  Download,
  Bookmark,
  ChevronRight,
  X,
  Eye,
  Share2,
  Printer,
  FileText,
  User,
  Clock as ClockIcon,
  Tag,
  Check,
  AlertTriangle,
  Zap,
  Award,
  Users,
  MapPin,
  Target,
  TrendingUp,
  Cpu,
  BookOpen,
  ExternalLink,
  MessageSquare,
  FileCheck,
  AlertOctagon,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useNavigate, useLocation } from 'react-router-dom';

const AnnouncementDetailContent = ({ announcement }) => {
  if (!announcement) return null;
  
  // Data deskripsi lengkap untuk pengumuman
  const announcementDetails = {
    1: {
      fullDescription: `Kementerian Keuangan secara resmi merilis Panduan Sistem e-Reporting Tahun 2026 yang merupakan pembaruan komprehensif dari versi sebelumnya. Panduan ini dikembangkan berdasarkan masukan dari pengguna selama setahun terakhir dan mengintegrasikan teknologi terbaru untuk meningkatkan efisiensi pelaporan keuangan negara.`,
      
      detailedInfo: `
        Panduan e-Reporting 2026 mencakup beberapa perubahan penting:
        Panduan ini wajib dipelajari oleh seluruh pengguna sistem e-Reporting sebelum melakukan pelaporan periode berikutnya.
      `
    }
  };

  const detail = announcementDetails[announcement.id] || {
    fullDescription: announcement.shortMessage || "Deskripsi lengkap pengumuman sedang dalam proses pembaruan. Silakan hubungi administrator untuk informasi lebih lanjut."
  };

  return (
    <div className="space-y-6">
      {/* Judul Pengumuman */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{announcement.title}</h2>
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-1" />
          <span>Dipublikasikan: {format(announcement.publishDate, 'dd MMMM yyyy', { locale: id })}</span>
          <span className="mx-2">•</span>
          <User className="w-4 h-4 mr-1" />
          <span>{announcement.author}</span>
        </div>
      </div>

      {/* Gambar */}
      <div className="rounded-xl overflow-hidden mb-6">
        <img 
          src={announcement.image} 
          alt={announcement.title}
          className="w-full h-auto max-h-96 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23fee2e2'/%3E%3Ctext x='400' y='200' text-anchor='middle' font-family='Arial' font-size='24' fill='%23dc2626'%3EE-REPORTING%3C/text%3E%3C/svg%3E";
          }}
        />
      </div>

      {/* Deskripsi Lengkap */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-red-500" />
          Deskripsi Lengkap
        </h3>
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {detail.fullDescription}
        </div>
      </div>

      {/* Detail Pengumuman */}
      <div className="bg-red-50 p-6 rounded-xl border border-red-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-red-500" />
          Detail Pengumuman
        </h3>
        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {detail.detailedInfo || detail.fullDescription}
        </div>
      </div>

      {/* Informasi Kontak (opsional, bisa dihapus jika tidak diperlukan) */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">Informasi Lebih Lanjut:</h4>
        <p className="text-sm text-gray-600">
          Untuk pertanyaan lebih lanjut mengenai pengumuman ini, silakan hubungi:<br />
          📞 Helpdesk: 021-1234-5678<br />
          ✉️ Email: helpdesk@ojk.go.id
        </p>
      </div>
    </div>
  );
};

const Pemberitahuan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Determine active tab from URL
  const activeTab = location.pathname.includes('pengumuman') ? 'pengumuman' : 'notifikasi';
  
  const notifications = [
    // {
    //   id: 1,
    //   title: "Laporan APOLO Berhasil Dikirim",
    //   message: "Laporan Keuangan Q1 2023 telah berhasil dikirim dan diverifikasi oleh sistem APOLO.",
    //   type: "aktivitas_pelaporan",
    //   timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    //   read: false,
    //   category: "apolo",
    //   notificationType: "aktivitas_pelaporan"
    // },
    // {
    //   id: 2,
    //   title: "Penyesuaian Hari Keterlambatan",
    //   message: "Jumlah hari keterlambatan pelaporan e-Reporting telah disesuaikan berdasarkan kalender libur nasional.",
    //   type: "adjust_hari",
    //   timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    //   read: false,
    //   category: "ereporting",
    //   notificationType: "adjust_hari"
    // },
    // {
    //   id: 3,
    //   title: "Konfirmasi Penerimaan Laporan",
    //   message: "Laporan Triwulan II telah diterima dan sedang dalam proses verifikasi oleh tim auditor.",
    //   type: "konfirmasi",
    //   timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    //   read: true,
    //   category: "sipina",
    //   notificationType: "konfirmasi"
    // },
    // {
    //   id: 4,
    //   title: "Panduan Baru e-Reporting 2026",
    //   message: "Panduan lengkap untuk penggunaan sistem e-Reporting tahun 2026 telah tersedia untuk diunduh.",
    //   type: "pengumuman",
    //   timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    //   read: false,
    //   category: "ereporting",
    //   notificationType: "pengumuman"
    // },
    {
      id: 5,
      title: "Aktivitas Pelaporan: APOLO",
      message: "Laporan APOLO bulanan telah berhasil diproses.",
      type: "aktivitas_pelaporan",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      read: true,
      category: "apolo",
      notificationType: "aktivitas_pelaporan"
    }
  ];

  // HANYA SATU PENGUMUMAN
  const announcements = [
    {
      id: 1,
      title: "Panduan Baru e-Reporting 2026",
      shortMessage: "Panduan lengkap untuk penggunaan sistem e-Reporting tahun 2026 telah tersedia untuk diunduh.",
      category: "ereporting",
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      publishDate: new Date('2026-01-10'),
      author: "Tim Pengembangan e-Reporting",
      tags: ["Panduan", "Update Sistem", "2026"],
      attachments: [
        { name: "Panduan Lengkap e-Reporting 2026.pdf", size: "2.4 MB" },
        { name: "Template Laporan.xlsx", size: "1.2 MB" },
        { name: "FAQ e-Reporting 2026.pdf", size: "1.8 MB" }
      ],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h-400&fit=crop",
      important: true,
      views: 1250,
      downloadCount: 842,
      readTime: "8 menit",
      lastUpdated: new Date('2026-01-09'),
      version: "v1.2"
    }
  ];

  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredNotifications = notifications.filter(notification => {
    if (categoryFilter !== 'all' && notification.category !== categoryFilter) return false;
    return true;
  });

  const filteredAnnouncements = announcements.filter(announcement => {
    if (categoryFilter !== 'all' && announcement.category !== categoryFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const readCount = notifications.filter(n => n.read).length;
  const importantAnnouncements = announcements.filter(a => a.important).length;
  
  // Total aktivitas pelaporan (notifikasi dengan tipe aktivitas_pelaporan)
  const totalAktivitasPelaporan = notifications.filter(n => n.notificationType === 'aktivitas_pelaporan').length;

  const getNotificationTypeIcon = (notificationType) => {
    const icons = {
      aktivitas_pelaporan: <FileCheck className="w-5 h-5 text-green-600" />,
      pengumuman: <Megaphone className="w-5 h-5 text-blue-600" />,
      adjust_hari: <RefreshCw className="w-5 h-5 text-orange-600" />,
      konfirmasi: <CheckCircle className="w-5 h-5 text-purple-600" />,
    };
    return icons[notificationType] || <Bell className="w-5 h-5 text-gray-500" />;
  };

  const getCategoryBadge = (category) => {
    const styles = {
      apolo: 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200',
      ereporting: 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border border-blue-200',
      sipina: 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200',
      system: 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border border-purple-200',
    };
    
    const labels = {
      apolo: 'APOLO',
      ereporting: 'E-REPORTING',
      sipina: 'SIPINA',
      system: 'SISTEM IRS',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[category]}`}>
        {labels[category]}
      </span>
    );
  };

  const getNotificationTypeBadge = (notificationType) => {
    const styles = {
      aktivitas_pelaporan: 'bg-green-100 text-green-800 border border-green-200',
      pengumuman: 'bg-blue-100 text-blue-800 border border-blue-200',
      adjust_hari: 'bg-orange-100 text-orange-800 border border-orange-200',
      konfirmasi: 'bg-purple-100 text-purple-800 border border-purple-200',
    };
    
    const labels = {
      aktivitas_pelaporan: 'Aktivitas Pelaporan',
      pengumuman: 'Pengumuman',
      adjust_hari: 'Penyesuaian Hari',
      konfirmasi: 'Konfirmasi',
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[notificationType]}`}>
        {labels[notificationType]}
      </span>
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m lalu`;
    if (diffHours < 24) return `${diffHours}j lalu`;
    if (diffDays < 7) return `${diffDays}h lalu`;
    return format(timestamp, 'dd MMM yyyy', { locale: id });
  };

  const formatFullDate = (date) => {
    return format(date, 'EEEE, dd MMMM yyyy', { locale: id });
  };

  const formatDateTime = (date) => {
    return format(date, 'dd MMM yyyy HH:mm', { locale: id });
  };

 

  // Handler untuk melihat detail pengumuman
  const handleViewDetail = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-red-900">Pengumuman</h1>
                <p className="text-red-600 text-sm">Informasi pengumuman penting</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* <div className="bg-white rounded-xl border border-red-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Notifikasi</p>
                </div>
                <Bell className="w-8 h-8 text-red-500" />
              </div>
            </div> */}

            <div className="bg-white rounded-xl border border-red-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Belum Dibaca</p>
                </div>
                <div className="relative">
                  <Mail className="w-8 h-8 text-red-500" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-red-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{readCount}</p>
                  <p className="text-sm text-gray-600 mt-1">Sudah Dibaca</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-red-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{announcements.length}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Pengumuman</p>
                </div>
                <Megaphone className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-red-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalAktivitasPelaporan}</p>
                  <p className="text-sm text-gray-600 mt-1">Aktivitas Pelaporan</p>
                </div>
                <FileCheck className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden mb-8">
          
          {/* Tab Navigation */}
       

          {/* Content Area */}
          <div className="p-4 md:p-6">
            {activeTab === 'notifikasi' ? (
              /* Notifikasi List */
              <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`bg-gradient-to-br from-white to-red-50 rounded-xl border ${
                        notification.read ? 'border-red-100' : 'border-red-200'
                      } p-4 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${
                          notification.read ? 'bg-red-50' : 'bg-red-100'
                        }`}>
                          {getNotificationTypeIcon(notification.notificationType)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                )}
                              </div>
                              <p className="text-gray-600 text-sm mt-1">
                                {notification.message}
                              </p>
                            </div>
                            <div className="flex items-center space-x-1 text-gray-500 text-sm">
                              <Calendar className="w-3 h-3" />
                              <span>{formatTimeAgo(notification.timestamp)}</span>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-red-100">
                            {getNotificationTypeBadge(notification.notificationType)}
                            {getCategoryBadge(notification.category)}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-2" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Tidak ada notifikasi</h3>
                    <p className="text-gray-600 text-sm">
                      Tidak ada notifikasi yang sesuai dengan filter yang dipilih.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Pengumuman List dengan Detail Modal */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAnnouncements.length > 0 ? (
                  filteredAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className={`bg-white rounded-xl border ${
                        announcement.important ? 'border-red-200 shadow-md' : 'border-red-100'
                      } overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}
                      onClick={() => handleViewDetail(announcement)}
                    >
                      {/* Gambar dengan Overlay */}
                      <div className="h-48 bg-red-100 relative overflow-hidden">
                        <img 
                          src={announcement.image} 
                          alt={announcement.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23fee2e2'/%3E%3Ctext x='400' y='200' text-anchor='middle' font-family='Arial' font-size='24' fill='%23dc2626'%3EE-REPORTING%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        {announcement.important && (
                          <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                            ⚠️ PENTING
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        {/* Category & Date */}
                        <div className="flex items-center justify-between mb-3">
                          {getCategoryBadge(announcement.category)}
                          <div className="flex items-center space-x-1 text-gray-500 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{formatTimeAgo(announcement.timestamp)}</span>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-gray-900 text-lg mb-3 line-clamp-2 hover:text-red-600 transition-colors">
                          {announcement.title}
                        </h3>

                        {/* Short Message */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {announcement.shortMessage}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {announcement.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center space-x-3 text-gray-500 text-xs pt-4 border-t border-gray-100">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-3 h-3" />
                            <span>{announcement.views.toLocaleString()}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ClockIcon className="w-3 h-3" />
                            <span>{announcement.readTime}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{announcement.attachments.length} lampiran</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Megaphone className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">Tidak ada pengumuman</h3>
                    <p className="text-gray-600 text-sm">
                      Tidak ada pengumuman yang sesuai dengan filter yang dipilih.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h4 className="text-lg font-bold mb-1">Informasi Pemberitahuan</h4>
              <p className="text-red-100 text-sm">
                {activeTab === 'notifikasi' 
                  ? 'Notifikasi mencakup aktivitas pelaporan, pengumuman, penyesuaian hari, dan konfirmasi'
                  : 'Klik pada pengumuman untuk melihat deskripsi lengkap'}
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-red-100">
              <p>Data diperbarui: {formatDateTime(new Date())}</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Klik pada pengumuman untuk melihat deskripsi lengkap. Untuk informasi lebih lanjut hubungi administrator.
          </p>
        </div>
      </div>

      {/* Modal Detail Pengumuman - DIPERBAIKI dengan konten yang lebih sederhana */}
      {isModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 z-10">
            {/* Modal Header - Sederhana */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Megaphone className="w-5 h-5 text-red-600 mr-2" />
                  <h2 className="text-lg font-bold text-gray-900">Detail Pengumuman</h2>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable dengan konten sederhana */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {/* Konten Detail Lengkap yang sudah disederhanakan */}
              <AnnouncementDetailContent announcement={selectedAnnouncement} />
            </div>

            {/* Modal Footer - Sederhana */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pemberitahuan;