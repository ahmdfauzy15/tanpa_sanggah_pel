// Sidebar.js - Update menu pengaturan
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  FileText, 
  Download, 
  Info, 
  HelpCircle,
  ChevronRight,
  ChevronDown,
  BarChart3,
  FileSignature,
  Gavel,
  User,
  Settings,
  X,
  Menu,
  Bell,
  LogOut,
  Sidebar as SidebarIcon,
  LayoutDashboard,
  ChevronLeft,
  Mail,
  Megaphone,
  Key,
  Shield,
  UserCheck,
  FileSpreadsheet,
  Eye,
  History,
  Database,
  UserCog
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [reportsOpen, setReportsOpen] = useState(false);
  const [correspondenceOpen, setCorrespondenceOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false); // State untuk menu Pengaturan
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const sidebarRef = useRef(null);
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      
      // Auto open sidebar on desktop
      if (newWidth >= 1024 && !isSidebarOpen) {
        toggleSidebar();
      }
      
      // Auto collapse on small desktop
      if (newWidth < 1280 && newWidth >= 1024) {
        setCollapsed(true);
      } else if (newWidth >= 1280) {
        setCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, toggleSidebar]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (windowWidth < 1024 && isSidebarOpen && sidebarRef.current && 
          !sidebarRef.current.contains(event.target) &&
          !event.target.closest('.mobile-toggle-btn')) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSidebarOpen, windowWidth, toggleSidebar]);

  // Menu items structure
  const menuItems = [
    { 
      id: 'home',
      path: '/', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      exact: true 
    },
      { 
      id: 'reports',
      path: '/absensi', 
      icon: BarChart3, 
      label: 'Monitoring Absensi',
      exact: true 
    },
    // {
    //   id: 'reports',
    //   type: 'dropdown',
    //   icon: FileText,
    //   label: 'Laporan',
    //   open: reportsOpen,
    //   toggle: () => setReportsOpen(!reportsOpen),
    //   subItems: [
    //     { path: '/apolo', icon: BarChart3, label: 'APOLO' },
    //     { path: '/ereporting', icon: FileSignature, label: 'e-Reporting' },
    //     { path: '/sipina', icon: Gavel, label: 'SIPINA' },
    //   ]
    // },
    { 
      id: 'correspondence',
      path: '/korespondensi/pengumuman', 
      icon: Megaphone, 
      label: 'Pengumuman',
      exact: true 
    },
    // {
    //   id: 'correspondence',
    //   type: 'dropdown',
    //   icon: Megaphone,
    //   label: 'Pemberitahuaan',
    //   open: correspondenceOpen,
    //   toggle: () => setCorrespondenceOpen(!correspondenceOpen),
    //   subItems: [
    //     { path: '/korespondensi/notifikasi', icon: Bell, label: 'Notifikasi' },
    //     { path: '/korespondensi/pengumuman', icon: Megaphone, label: 'Pengumuman' },
    //   ]
    // },
    
    { 
      id: 'download',
      path: '/download', 
      icon: Download, 
      label: 'Download' 
    },
  ];

  // Menu Pengaturan dengan submenu Profil dan Hak Akses
  const settingsMenu = {
    id: 'settings',
    type: 'dropdown',
    icon: UserCog, 
    label: 'Pengaturan',
    open: settingsOpen,
    toggle: () => setSettingsOpen(!settingsOpen),
    subItems: [
      { 
        path: '/accessmanagement', 
        icon: User, 
        label: 'Profil',
        exact: true 
      },
      { 
        path: '/profile/hak-akses', 
        icon: Key, 
        label: 'Hak Akses' 
      },
    ]
  };

  const bottomMenuItems = [
    { 
      id: 'about',
      path: '/about', 
      icon: Info, 
      label: 'Tentang Kami' 
    },
    { 
      id: 'faq',
      path: '/faq', 
      icon: HelpCircle, 
      label: 'FAQ' 
    },
    { 
      id: 'logout',
      path: '/admin/dashboard', 
      icon: LogOut, 
      label: 'Keluar' 
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleMenuItemClick = (path) => {
    if (path === '/logout') {
      if (window.confirm('Apakah Anda yakin ingin keluar?')) {
        alert('Anda telah logout');
        navigate('/');
      }
      return;
    }
    
    navigate(path);
    
    // Close sidebar on mobile after clicking menu item
    if (windowWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleToggleCollapse = () => {
    if (windowWidth >= 1024) {
      setCollapsed(!collapsed);
    }
  };

  // Modern active indicator - subtle dot
  const renderActiveIndicator = (isActive) => {
    if (!isActive) return null;
    
    return (
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-red-600 rounded-r-full"></div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && windowWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div 
        ref={sidebarRef}
        className={`
          fixed lg:sticky lg:top-0
          top-0 left-0 h-screen
          z-40
          transition-all duration-300 ease-in-out
          ${windowWidth >= 1024 
            ? collapsed 
              ? 'lg:w-16' 
              : 'lg:w-64'
            : isSidebarOpen 
              ? 'translate-x-0 w-72' 
              : '-translate-x-full w-72'
          }
          bg-white
          border-r border-red-200
          shadow-xl lg:shadow-md
          flex flex-col
          overflow-hidden
        `}
      >
        {/* Sidebar Header */}
        <div className={`
          p-4 border-b border-red-100 flex-shrink-0
          ${collapsed && windowWidth >= 1024 ? 'px-3' : 'px-6'}
        `}>
          <div className={`flex items-center ${collapsed && windowWidth >= 1024 ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center ${collapsed && windowWidth >= 1024 ? '' : 'space-x-3'}`}>
              <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-red-600 flex-shrink-0">
                <img 
                  src="/irs-logos.png" 
                  alt="Logo IRS" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {(!collapsed || windowWidth < 1024) && (
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-gray-900">IRS OJK</h1>
                  <p className="text-xs text-gray-500">Sistem Terpusat</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items - Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className={collapsed && windowWidth >= 1024 ? 'px-2' : 'px-4'}>
            <div className="space-y-1">
              {menuItems.map((item) => {
                if (item.type === 'dropdown') {
                  // Don't show dropdown in collapsed mode on desktop
                  if (collapsed && windowWidth >= 1024) return null;
                  
                  return (
                    <div key={item.id} className="mb-1">
                      <button
                        onClick={item.toggle}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`
                          w-full flex items-center ${collapsed && windowWidth >= 1024 ? 'justify-center' : 'justify-between'} 
                          ${collapsed && windowWidth >= 1024 ? 'px-3' : 'px-3'} py-3 rounded-lg
                          transition-all duration-200
                          hover:bg-red-50
                          relative
                          ${item.open 
                            ? 'bg-red-50 text-red-700' 
                            : 'text-gray-700 hover:text-red-700'
                          }
                        `}
                      >
                        <div className={`flex items-center ${collapsed && windowWidth >= 1024 ? '' : 'space-x-3'}`}>
                          <item.icon className={`w-5 h-5 ${item.open ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'}`} />
                          {(!collapsed || windowWidth < 1024) && (
                            <span className="font-medium">{item.label}</span>
                          )}
                        </div>
                        
                        {(!collapsed || windowWidth < 1024) && (
                          item.open ? (
                            <ChevronDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                          )
                        )}

                        {/* Tooltip for collapsed mode */}
                        {collapsed && windowWidth >= 1024 && (
                          <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                            {item.label}
                            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                          </div>
                        )}
                      </button>
                      
                      {item.open && (!collapsed || windowWidth < 1024) && (
                        <div className="mt-1 ml-4 space-y-1">
                          {item.subItems.map((subItem) => {
                            const active = isActive(subItem.path, subItem.exact);
                            return (
                              <button
                                key={subItem.label}
                                onClick={() => handleMenuItemClick(subItem.path)}
                                onMouseEnter={() => setHoveredItem(subItem.label)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className={`
                                  w-full flex items-center space-x-3 
                                  px-3 py-2.5 rounded-lg
                                  transition-all duration-200
                                  hover:bg-red-50
                                  relative
                                  ${active 
                                    ? 'bg-red-50 text-red-700' 
                                    : 'text-gray-600 hover:text-red-700'
                                  }
                                `}
                              >
                                {renderActiveIndicator(active)}
                                <subItem.icon className={`w-4 h-4 ${active ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'}`} />
                                <span className="text-sm">{subItem.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // Regular menu item
                const active = isActive(item.path, item.exact);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuItemClick(item.path)}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`
                      w-full flex items-center ${collapsed && windowWidth >= 1024 ? 'justify-center' : 'justify-between'} 
                      ${collapsed && windowWidth >= 1024 ? 'px-3' : 'px-3'} py-3 rounded-lg
                      transition-all duration-200
                      hover:bg-red-50
                      relative
                      ${active 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-gray-700 hover:text-red-700'
                      }
                    `}
                  >
                    {renderActiveIndicator(active)}
                    
                    <div className={`flex items-center ${collapsed && windowWidth >= 1024 ? '' : 'space-x-3'}`}>
                      <item.icon className={`w-5 h-5 ${active ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'}`} />
                      {(!collapsed || windowWidth < 1024) && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>

                    {/* Tooltip for collapsed mode */}
                    {collapsed && windowWidth >= 1024 && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        {item.label}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Menu Pengaturan */}
              {!collapsed || windowWidth < 1024 ? (
                <div className="mb-1">
                  <button
                    onClick={settingsMenu.toggle}
                    onMouseEnter={() => setHoveredItem(settingsMenu.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className={`
                      w-full flex items-center ${collapsed && windowWidth >= 1024 ? 'justify-center' : 'justify-between'} 
                      ${collapsed && windowWidth >= 1024 ? 'px-3' : 'px-3'} py-3 rounded-lg
                      transition-all duration-200
                      hover:bg-red-50
                      relative
                      ${settingsMenu.open 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-gray-700 hover:text-red-700'
                      }
                    `}
                  >
                    <div className={`flex items-center ${collapsed && windowWidth >= 1024 ? '' : 'space-x-3'}`}>
                      <settingsMenu.icon className={`w-5 h-5 ${settingsMenu.open ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'}`} />
                      {(!collapsed || windowWidth < 1024) && (
                        <span className="font-medium">{settingsMenu.label}</span>
                      )}
                    </div>
                    
                    {(!collapsed || windowWidth < 1024) && (
                      settingsMenu.open ? (
                        <ChevronDown className="w-4 h-4 text-red-600" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                      )
                    )}

                    {/* Tooltip for collapsed mode */}
                    {collapsed && windowWidth >= 1024 && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                        {settingsMenu.label}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                      </div>
                    )}
                  </button>
                  
                  {settingsMenu.open && (!collapsed || windowWidth < 1024) && (
                    <div className="mt-1 ml-4 space-y-1">
                      {settingsMenu.subItems.map((subItem) => {
                        const active = isActive(subItem.path, subItem.exact);
                        return (
                          <button
                            key={subItem.label}
                            onClick={() => handleMenuItemClick(subItem.path)}
                            onMouseEnter={() => setHoveredItem(subItem.label)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`
                              w-full flex items-center space-x-3 
                              px-3 py-2.5 rounded-lg
                              transition-all duration-200
                              hover:bg-red-50
                              relative
                              ${active 
                                ? 'bg-red-50 text-red-700' 
                                : 'text-gray-600 hover:text-red-700'
                              }
                            `}
                          >
                            {renderActiveIndicator(active)}
                            <subItem.icon className={`w-4 h-4 ${active ? 'text-red-600' : 'text-gray-500 group-hover:text-red-600'}`} />
                            <span className="text-sm">{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Bottom Menu */}
            <div className={`${collapsed && windowWidth >= 1024 ? 'mt-4' : 'mt-8 pt-6 border-t border-red-50'}`}>
              <div className="space-y-1">
                {bottomMenuItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.path)}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`
                        w-full flex items-center ${collapsed && windowWidth >= 1024 ? 'justify-center' : ''} 
                        ${collapsed && windowWidth >= 1024 ? 'px-3' : 'px-3'} py-3 rounded-lg
                        transition-all duration-200
                        hover:bg-red-50
                        relative
                        ${active 
                          ? 'bg-red-50 text-red-700' 
                          : 'text-gray-700 hover:text-red-700'
                        }
                        ${item.id === 'logout' ? 'text-red-600 hover:text-red-700 hover:bg-red-50' : ''}
                      `}
                    >
                      {renderActiveIndicator(active)}
                      
                      <div className={`flex items-center ${collapsed && windowWidth >= 1024 ? '' : 'space-x-3'}`}>
                        <item.icon className={`w-5 h-5 ${active ? 'text-red-600' : item.id === 'logout' ? 'text-red-500' : 'text-gray-600 group-hover:text-red-600'}`} />
                        {(!collapsed || windowWidth < 1024) && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </div>

                      {/* Tooltip for collapsed mode */}
                      {collapsed && windowWidth >= 1024 && (
                        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-50">
                          {item.label}
                          <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className={`
          p-4 border-t border-red-50 flex-shrink-0
          ${collapsed && windowWidth >= 1024 ? 'px-3 text-center' : ''}
        `}>
          {collapsed && windowWidth >= 1024 ? (
            <button
              onClick={handleToggleCollapse}
              className="w-full p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
              title="Expand sidebar"
            >
              <ChevronRight className="w-4 h-4 mx-auto" />
            </button>
          ) : (
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                <p>OJK © 2026</p>
              </div>
              {windowWidth >= 1024 && (
                <button
                  onClick={handleToggleCollapse}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;