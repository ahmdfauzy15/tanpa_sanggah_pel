import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileArchive,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Share2,
  File,
  Database,
  X,
  Eye,
  Calendar,
  HardDrive,
  Users,
  BarChart,
  Clock,
  Copy,
  Info,
  ChevronRight,
  AppWindow,
  BookOpen,
  Terminal,
  Monitor,
  Smartphone
} from 'lucide-react';

// Data dokumentasi baru
const dokumentasiData = [
  {
    id: 1,
    title: 'Panduan Pengguna IRS',
    description: 'Panduan lengkap penggunaan sistem IRS untuk semua pengguna',
    category: 'Umum',
    size: '2.5 MB',
    format: 'PDF',
    lastUpdated: '2024-01-15',
    downloads: 1245,
    status: 'Aktif'
  },
  {
    id: 2,
    title: 'Manual APOLO',
    description: 'Dokumentasi lengkap modul APOLO dan cara penggunaannya',
    category: 'APOLO',
    size: '1.8 MB',
    format: 'PDF',
    lastUpdated: '2024-01-10',
    downloads: 892,
    status: 'Aktif'
  },
  {
    id: 3,
    title: 'Petunjuk e-Reporting',
    description: 'Panduan teknis untuk pelaporan elektronik',
    category: 'e-Reporting',
    size: '1.2 MB',
    format: 'PDF',
    lastUpdated: '2024-01-05',
    downloads: 756,
    status: 'Aktif'
  },
  {
    id: 4,
    title: 'Dokumentasi SIPINA',
    description: 'Manual penggunaan sistem pelaporan SIPINA',
    category: 'SIPINA',
    size: '1.5 MB',
    format: 'PDF',
    lastUpdated: '2024-01-12',
    downloads: 634,
    status: 'Aktif'
  },
  {
    id: 5,
    title: 'API Documentation',
    description: 'Dokumentasi API untuk integrasi sistem',
    category: 'Teknis',
    size: '800 KB',
    format: 'PDF',
    lastUpdated: '2024-01-08',
    downloads: 421,
    status: 'Aktif'
  }
];

const aplikasiPendukung = [
  {
    id: 1,
    name: 'APOLO Client',
    version: 'v3.2.0',
    size: '2 MB',
    description: 'Klien APOLO untuk sistem APOLO dengan fitur Pelengkap',
    requirements: 'Windows 10/11',
    downloadLink: '#',
    category: 'desktop',
    aplikasi: 'APOLO',
    icon: Terminal,
    color: 'from-red-600 to-red-700'
  }
  // {
  //   id: 2,
  //   name: 'e-Reporting Tool',
  //   version: 'v2.1.0',
  //   size: '1.5 MB',
  //   description: 'Aplikasi untuk pelaporan elektronik e-Reporting',
  //   requirements: 'Windows 10/11, 1GB RAM, 50mb Storage',
  //   downloadLink: '#',
  //   category: 'desktop',
  //   aplikasi: 'EREPORTING',
  //   icon: Monitor,
  //   color: 'from-red-600 to-red-700'
  // },
  // {
  //   id: 3,
  //   name: 'SIPINA Mobile',
  //   version: 'v1.8.0',
  //   size: '3 MB',
  //   description: 'Aplikasi mobile SIPINA untuk pelaporan mobile',
  //   requirements: 'Android 8.0+, 2GB RAM, 50mb Storage',
  //   downloadLink: '#',
  //   category: 'mobile',
  //   aplikasi: 'SIPINA',
  //   icon: Smartphone,
  //   color: 'from-red-600 to-red-700'
  // }
];

const DownloadCenter = () => {
  const [activeTab, setActiveTab] = useState('dokumentasi');
  const [downloads, setDownloads] = useState(dokumentasiData);
  const [filteredDownloads, setFilteredDownloads] = useState(dokumentasiData);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadProgress, setDownloadProgress] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const categoryDropdownRef = useRef(null);
  
  const [selectedCategories, setSelectedCategories] = useState(['Umum', 'APOLO', 'e-Reporting', 'SIPINA', 'Teknis']);
  
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  const categoryOptions = ['Umum', 'APOLO', 'e-Reporting', 'SIPINA', 'Teknis'];

  const fileTypes = {
    PDF: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50', label: 'PDF' },
    DOC: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50', label: 'DOC' },
    XLS: { icon: FileSpreadsheet, color: 'text-red-500', bg: 'bg-red-50', label: 'Excel' },
    ZIP: { icon: FileArchive, color: 'text-red-500', bg: 'bg-red-50', label: 'ZIP' }
  };

  const appCategoryColors = {
    desktop: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    mobile: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    web: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    server: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800' },
    development: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle multiple category selection dengan dropdown
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(item => item !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  // Select all categories
  const selectAllCategories = () => {
    setSelectedCategories([...categoryOptions]);
  };

  // Clear all categories
  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  // Apply filters for documentation
  useEffect(() => {
    if (activeTab === 'dokumentasi') {
      let result = downloads;

      // Filter by search query
      if (searchQuery) {
        result = result.filter(file => {
          return (
            file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            file.description.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }

      // Filter by category (multiple selection)
      if (selectedCategories.length > 0) {
        result = result.filter(file => selectedCategories.includes(file.category));
      }

      // Apply sorting
      if (sortConfig.key) {
        result = [...result].sort((a, b) => {
          let aValue, bValue;

          switch(sortConfig.key) {
            case 'title':
              aValue = a.title;
              bValue = b.title;
              break;
            case 'category':
              aValue = a.category;
              bValue = b.category;
              break;
            case 'format':
              aValue = a.format;
              bValue = b.format;
              break;
            default:
              aValue = a[sortConfig.key];
              bValue = b[sortConfig.key];
          }

          if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }

      setFilteredDownloads(result);
    }
  }, [searchQuery, selectedCategories, sortConfig, downloads, activeTab]);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ChevronsUpDown className="w-4 h-4 ml-1 text-red-400" />;
    }
    if (sortConfig.direction === 'ascending') {
      return <ChevronUp className="w-4 h-4 ml-1 text-red-600" />;
    }
    return <ChevronDown className="w-4 h-4 ml-1 text-red-600" />;
  };

  const handleDownload = async (file, isBulk = false, isApp = false) => {
    if (isBulk && selectedFiles.length === 0) {
      alert('Pilih file yang ingin diunduh');
      return;
    }

    const filesToDownload = isBulk ? 
      downloads.filter(f => selectedFiles.includes(f.id)) : 
      [file];

    filesToDownload.forEach(item => {
      const fileId = isApp ? `app-${item.id}` : item.id;
      setDownloadProgress(prev => ({ ...prev, [fileId]: 0 }));
      
      const interval = setInterval(() => {
        setDownloadProgress(prev => {
          const progress = prev[fileId] + 10;
          if (progress >= 100) {
            clearInterval(interval);
            
            if (!isApp) {
              setDownloads(prev => prev.map(f => 
                f.id === item.id ? { ...f, downloads: f.downloads + 1 } : f
              ));
            }

            if (isBulk) {
              setSelectedFiles([]);
            }

            // Create and trigger download
            setTimeout(() => {
              const content = isApp 
                ? `Aplikasi: ${item.name}\nVersi: ${item.version}\nUkuran: ${item.size}\nRequirements: ${item.requirements}`
                : `Dokumen: ${item.title}\nKategori: ${item.category}\nDeskripsi: ${item.description}\nUkuran: ${item.size}\nFormat: ${item.format}`;
              
              const blob = new Blob([content], { type: 'text/plain' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = isApp ? `${item.name.replace(/\s+/g, '_')}.txt` : `${item.title.replace(/\s+/g, '_')}.txt`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 300);

            return { ...prev, [fileId]: 100 };
          }
          return { ...prev, [fileId]: progress };
        });
      }, 100);
    });
  };

  const handleShare = (file, isApp = false) => {
    setSelectedFile({...file, isApp});
    setShowShareModal(true);
  };

  const handleViewDetails = (file, isApp = false) => {
    setSelectedFile({...file, isApp});
    setShowDetailModal(true);
  };

  const handleBulkDownload = () => {
    if (selectedFiles.length > 0) {
      handleDownload(null, true);
    }
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredDownloads.length && filteredDownloads.length > 0) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredDownloads.map(f => f.id));
    }
  };

  const handleSelectFile = (id) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories(['Umum', 'APOLO', 'e-Reporting', 'SIPINA', 'Teknis']);
    setSearchQuery('');
    setShowFilters(false);
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'Umum': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      case 'APOLO': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      case 'e-Reporting': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      case 'SIPINA': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      case 'Teknis': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
      default: return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    }
  };

  // Format tanggal
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter aplikasi berdasarkan kategori
  const filteredApps = aplikasiPendukung;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan tema merah */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden border border-red-100">
          <div className="p-6 md:p-8 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg">
                  <Download className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-red-900">
                    Pusat Unduhan
                  </h1>
                  <p className="text-sm text-red-600 mt-1">
                    Unduh aplikasi pendukung dan semua dokumentasi
                  </p>
                </div>
              </div>
              
              {/* Tab Navigation - Responsive */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setActiveTab('aplikasi')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    activeTab === 'aplikasi'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-red-700 hover:text-red-900 hover:bg-red-50 border border-red-200'
                  }`}
                >
                  <AppWindow className="w-4 h-4" />
                  <span className="truncate">Aplikasi Pendukung</span>
                </button>
                <button
                  onClick={() => setActiveTab('dokumentasi')}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                    activeTab === 'dokumentasi'
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg'
                      : 'text-red-700 hover:text-red-900 hover:bg-red-50 border border-red-200'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="truncate">Dokumentasi</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 md:p-6 border-b border-red-100 bg-red-50/50">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'aplikasi' 
                      ? "Cari aplikasi pendukung..." 
                      : "Cari dokumentasi, kategori, atau deskripsi..."
                  }
                  className="w-full pl-10 pr-4 py-2.5 border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-red-900 placeholder-red-500 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between lg:justify-end space-x-4">
                <div className="text-sm text-red-700">
                  <span className="font-semibold text-red-800">
                    {activeTab === 'aplikasi' ? filteredApps.length : filteredDownloads.length}
                  </span>{" "}
                  {activeTab === 'aplikasi' ? 'aplikasi tersedia' : 'dokumen tersedia'}
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2.5 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-300 text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span className="font-medium">Filter</span>
                </button>
              </div>
            </div>

            {showFilters && activeTab === 'dokumentasi' && (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 p-4 bg-white rounded-xl border border-red-200">
                {/* Filter Kategori */}
                <div className="relative" ref={categoryDropdownRef}>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Kategori
                  </label>
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full flex items-center justify-between px-4 py-2.5 border border-red-300 rounded-xl bg-white text-red-900 hover:bg-red-50 transition-colors"
                  >
                    <span className="truncate text-sm">
                      {selectedCategories.length === 0 ? 'Pilih Kategori' : 
                       selectedCategories.length === categoryOptions.length ? 'Semua Kategori' :
                       `${selectedCategories.length} terpilih`}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''} text-red-400`} />
                  </button>
                  
                  {showCategoryDropdown && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-red-300 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      <div className="p-2 border-b border-red-200">
                        <div className="flex justify-between">
                          <button
                            onClick={selectAllCategories}
                            className="text-xs text-red-600 hover:text-red-800 px-2 py-1"
                          >
                            Pilih Semua
                          </button>
                          <button
                            onClick={clearAllCategories}
                            className="text-xs text-red-600 hover:text-red-800 px-2 py-1"
                          >
                            Hapus Semua
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        {categoryOptions.map(cat => (
                          <label key={cat} className="flex items-center space-x-2 p-2 hover:bg-red-50 rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCategories.includes(cat)}
                              onChange={() => toggleCategory(cat)}
                              className="rounded border-red-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-red-700">{cat}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="p-4 md:p-6">
            {activeTab === 'aplikasi' ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-red-900">
                    Aplikasi Pendukung Sistem
                  </h2>
                  {/* <div className="text-sm text-red-600">
                    Unduh aplikasi yang sesuai dengan kebutuhan Anda
                  </div> */}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredApps.map((app) => {
                    const Icon = app.icon;
                    const categoryColor = appCategoryColors[app.category] || appCategoryColors.desktop;
                    const progressKey = `app-${app.id}`;
                    
                    return (
                      <div 
                        key={app.id}
                        className={`${categoryColor.bg} border ${categoryColor.border} rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${app.color} shadow-lg`}>
                            <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                          </div>
                          <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
                            {app.category}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-red-900 text-base md:text-lg mb-2 line-clamp-1">
                          {app.name}
                        </h3>
                        
                        <p className="text-sm text-red-600 mb-4 line-clamp-2">
                          {app.description}
                        </p>
                        
                        <div className="space-y-2 mb-4 md:mb-6">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-red-600">Versi</span>
                            <span className="font-medium text-red-800">{app.version}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-red-600">Ukuran</span>
                            <span className="font-medium text-red-800">{app.size}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-red-600">Kompatibilitas</span>
                            <span className="font-medium text-red-800 text-right max-w-[140px] truncate" title={app.requirements}>
                              {app.requirements.split(',')[0]}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 md:space-x-3">
                          <button
                            onClick={() => handleDownload(app, false, true)}
                            disabled={downloadProgress[progressKey] > 0}
                            className="flex-1 flex items-center justify-center space-x-2 px-3 md:px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 text-sm"
                          >
                            {downloadProgress[progressKey] > 0 ? (
                              <>
                                <div className="w-3 h-3 md:w-4 md:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="truncate">Mengunduh...</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-4 h-4" />
                                <span className="font-medium truncate">Unduh .EXE</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleViewDetails(app, true)}
                            className="p-2 md:p-3 border border-red-300 text-red-700 rounded-xl hover:bg-red-50 transition-all duration-300 flex-shrink-0"
                            title="Lihat detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Dokumentasi Table - Responsive */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-red-900">
                    Dokumentasi Sistem
                  </h2>
                  <div className="text-sm text-red-600">
                    Pilih file untuk melihat detail dan mengunduh
                  </div>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg">
                        <Download className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-red-900">
                          {selectedFiles.length} file terpilih
                        </p>
                        <p className="text-sm text-red-600">
                          Siap untuk diunduh secara bersamaan
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleBulkDownload}
                      className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg text-sm w-full sm:w-auto"
                    >
                      <Download className="w-4 h-4" />
                      <span className="font-medium">Unduh Semua</span>
                    </button>
                  </div>
                )}

                <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-red-200">
                      <thead className="bg-red-50">
                        <tr>
                          <th className="px-4 py-3 text-left w-12">
                            <input
                              type="checkbox"
                              checked={selectedFiles.length === filteredDownloads.length && filteredDownloads.length > 0}
                              onChange={handleSelectAll}
                              className="rounded border-red-300 focus:ring-red-500 text-red-600 w-4 h-4"
                            />
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors"
                            onClick={() => requestSort('title')}
                          >
                            <div className="flex items-center">
                              <span className="truncate">Judul</span>
                              {getSortIcon('title')}
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors hidden md:table-cell"
                            onClick={() => requestSort('category')}
                          >
                            <div className="flex items-center">
                              <span className="truncate">Kategori</span>
                              {getSortIcon('category')}
                            </div>
                          </th>
                          <th 
                            className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider cursor-pointer hover:bg-red-100 transition-colors hidden lg:table-cell"
                            onClick={() => requestSort('format')}
                          >
                            <div className="flex items-center">
                              <span className="truncate">Format</span>
                              {getSortIcon('format')}
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                            Ukuran
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                            <span className="sr-only">Aksi</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-red-100">
                        {filteredDownloads.map((file) => {
                          const FileIcon = fileTypes[file.format]?.icon || FileText;
                          const fileTypeConfig = fileTypes[file.format] || fileTypes.PDF;
                          const categoryColor = getCategoryColor(file.category);
                          
                          return (
                            <React.Fragment key={file.id}>
                              <tr 
                                className={`hover:bg-red-50 transition-colors ${
                                  selectedFiles.includes(file.id) ? 'bg-red-50' : ''
                                }`}
                              >
                                <td className="px-4 py-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedFiles.includes(file.id)}
                                    onChange={() => handleSelectFile(file.id)}
                                    className="rounded border-red-300 focus:ring-red-500 text-red-600 w-4 h-4"
                                  />
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-start space-x-3 min-w-0">
                                    <div className={`p-2 rounded-lg ${fileTypeConfig.bg} flex-shrink-0 mt-1`}>
                                      <FileIcon className={`w-4 h-4 ${fileTypeConfig.color}`} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div 
                                        className="font-medium text-red-900 cursor-pointer hover:text-red-700 truncate max-w-[150px] sm:max-w-xs"
                                        onClick={() => handleViewDetails(file)}
                                        title="Klik untuk melihat detail lengkap"
                                      >
                                        {file.title}
                                      </div>
                                      <div className="text-xs text-red-500 flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                                        <span className="capitalize">{fileTypeConfig.label}</span>
                                        <span className="text-red-300">•</span>
                                        <span>{file.size}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 hidden md:table-cell">
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border} truncate max-w-[120px]`}>
                                    {file.category}
                                  </span>
                                </td>
                                <td className="px-4 py-4 hidden lg:table-cell">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                                    {file.format}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-sm text-red-700">{file.size}</span>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => handleDownload(file)}
                                      disabled={downloadProgress[file.id] > 0}
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300 disabled:opacity-50 border border-red-200 hover:border-red-300"
                                      title="Unduh"
                                    >
                                      {downloadProgress[file.id] > 0 ? (
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                      ) : (
                                        <Download className="w-4 h-4" />
                                      )}
                                    </button>
                                    
                                    <button
                                      onClick={() => handleViewDetails(file)}
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300 border border-red-200 hover:border-red-300"
                                      title="Lihat detail"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    
                                    <button
                                      onClick={() => toggleRowExpansion(file.id)}
                                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300 border border-red-200 hover:border-red-300"
                                      title={expandedRows.includes(file.id) ? "Sembunyikan detail" : "Tampilkan detail"}
                                    >
                                      <ChevronRight className={`w-4 h-4 transition-transform ${expandedRows.includes(file.id) ? 'rotate-90' : ''}`} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              
                              {/* Expanded Row untuk Detail Tambahan */}
                              {expandedRows.includes(file.id) && (
                                <tr className="bg-red-50">
                                  <td colSpan="6" className="px-4 py-4">
                                    <div className="bg-white rounded-xl border border-red-200 p-4">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                          <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                                            <Info className="w-4 h-4 mr-2 text-red-500" />
                                            Detail File
                                          </h4>
                                          <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm text-red-600">Format</span>
                                              <span className="font-medium text-red-900">{file.format}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm text-red-600">Ukuran</span>
                                              <span className="font-medium text-red-900">{file.size}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <span className="text-sm text-red-600">Status</span>
                                              <span className={`text-xs px-2 py-1 rounded-full ${
                                                file.status === 'Aktif' 
                                                  ? 'bg-green-100 text-green-800' 
                                                  : 'bg-red-100 text-red-800'
                                              }`}>
                                                {file.status}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        
                                        
                                        <div>
                                          <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
                                            <Users className="w-4 h-4 mr-2 text-red-500" />
                                            Aksi Cepat
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            <button
                                              onClick={() => handleDownload(file)}
                                              className="text-xs px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300"
                                            >
                                              Unduh Sekarang
                                            </button>
                                            {/* <button
                                              onClick={() => handleShare(file)}
                                              className="text-xs px-3 py-1.5 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all duration-300"
                                            >
                                              Bagikan
                                            </button> */}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                        
                        {filteredDownloads.length === 0 && (
                          <tr>
                            <td colSpan="6" className="px-4 py-12 text-center">
                              <div className="text-red-500">
                                <Search className="w-12 h-12 mx-auto mb-3 text-red-300" />
                                <p className="text-lg font-medium mb-2 text-red-700">Tidak ada dokumen ditemukan</p>
                                <p className="mb-4 text-red-600">Coba ubah filter pencarian atau reset filter</p>
                                <button
                                  onClick={handleResetFilters}
                                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md"
                                >
                                  Reset Filter
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full border border-red-100 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 p-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-white rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-red-900">Detail {selectedFile.isApp ? 'Aplikasi' : 'Dokumen'} Lengkap</h3>
                  <p className="text-sm text-red-600 mt-1">
                    Informasi lengkap tentang {selectedFile.isApp ? 'aplikasi ini' : 'dokumen ini'}
                  </p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="text-sm font-medium text-red-700 mb-2">Nama {selectedFile.isApp ? 'Aplikasi' : 'Dokumen'}</h4>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="font-semibold text-red-900 whitespace-pre-wrap break-words leading-relaxed">
                    {selectedFile.isApp ? selectedFile.name : selectedFile.title}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Informasi {selectedFile.isApp ? 'Aplikasi' : 'File'}
                    </h4>
                    <div className="bg-white border border-red-100 rounded-lg p-4">
                      <div className="space-y-3">
                        {selectedFile.isApp ? (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Versi</span>
                              <span className="font-medium text-red-900">{selectedFile.version}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Ukuran</span>
                              <span className="font-medium text-red-900">{selectedFile.size}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Kategori</span>
                              <span className="font-medium text-red-900">{selectedFile.category}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Format</span>
                              <span className="font-medium text-red-900">{selectedFile.format}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Ukuran</span>
                              <span className="font-medium text-red-900">{selectedFile.size}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Kategori</span>
                              <span className="font-medium text-red-900">{selectedFile.category}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Status</span>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                selectedFile.status === 'Aktif' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {selectedFile.status}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-red-700 mb-3 flex items-center">
                      <BarChart className="w-4 h-4 mr-2" />
                      {selectedFile.isApp ? 'Requirements' : 'Informasi Tambahan'}
                    </h4>
                    <div className="bg-white border border-red-100 rounded-lg p-4">
                      <div className="space-y-3">
                        {selectedFile.isApp ? (
                          <div>
                            <p className="text-sm text-red-600 mb-2">System Requirements:</p>
                            <p className="font-medium text-red-900">{selectedFile.requirements}</p>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Deskripsi</span>
                              <span className="font-medium text-red-900 text-right max-w-[200px]">{selectedFile.description}</span>
                            </div>
                            {/* <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Terakhir Update</span>
                              <span className="font-medium text-red-900">{formatDate(selectedFile.lastUpdated)}</span>
                            </div> */}
                            {/* <div className="flex items-center justify-between">
                              <span className="text-sm text-red-600">Total Unduhan</span>
                              <span className="font-medium text-red-900">{selectedFile.downloads} kali</span>
                            </div> */}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-red-100">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      handleDownload(selectedFile, false, selectedFile.isApp);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    <span>Unduh Sekarang</span>
                  </button>
                  {/* <button
                    onClick={() => {
                      handleShare(selectedFile, selectedFile.isApp);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Bagikan</span>
                  </button> */}
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                    <span>Tutup</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-red-100 shadow-2xl">
            <div className="p-6 border-b border-red-100 bg-gradient-to-r from-red-50 to-red-100/50 rounded-t-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-red-900">Bagikan {selectedFile.isApp ? 'Aplikasi' : 'Dokumen'}</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-red-600 mt-1 truncate">{selectedFile.isApp ? selectedFile.name : selectedFile.title}</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Email Penerima
                  </label>
                  <input
                    type="email"
                    className="w-full border border-red-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-red-900"
                    placeholder="nama@contoh.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Pesan (Opsional)
                  </label>
                  <textarea
                    className="w-full border border-red-300 rounded-lg px-3 py-2.5 h-24 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-red-900"
                    placeholder="Tambahkan pesan untuk penerima..."
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-red-100 flex justify-end space-x-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-all duration-300"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  alert(`${selectedFile.isApp ? 'Aplikasi' : 'Dokumen'} berhasil dibagikan!`);
                  setShowShareModal(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DownloadCenter;