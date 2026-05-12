import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, CheckCircle, Eye, FileText, Database, Package, Layers, Shield } from 'lucide-react';

const SimpleProfile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Data profil dari sistem
    const profileData = {
      nama: 'John Doe',
      email: 'john.doe@contohljk.co.id',
      telepon: '+62 812-3456-7890'
    };
    setUserProfile(profileData);
  }, []);

  // DATA HAK AKSES MANUAL - APOLO dan ARO digabung jadi satu
  const hakAksesData = [
    {
      id: 1,
      aplikasi: 'APOLO',
      appKey: 'apolo',
      status: 'approved',
      trackingId: 'IRS-APOLO-2024001',
      tanggalApproval: '15 Januari 2024',
      aroList: ['ARO Manajer Investasi ', 'RO APU PPT'],
      isARO: true
    },
    {
      id: 2,
      aplikasi: 'Ereporting',
      appKey: 'ereporting',
      status: 'approved',
      trackingId: 'IRS-EREP-2024002',
      tanggalApproval: '10 Maret 2024',
      modul: 'Kegiatan Usaha Bullion, Dana Pensiun Lembaga Keuangan',
      isARO: false
    },
    {
      id: 3,
      aplikasi: 'SIPINA',
      appKey: 'sipina',
      status: 'approved',
      trackingId: 'IRS-SIP-2024003',
      tanggalApproval: '5 April 2024',
      modul: 'Perbankan, Asuransi',
      isARO: false
    }
  ];

  if (!userProfile) return null;

  const profileItems = [
    {
      icon: User,
      label: 'Nama Lengkap',
      value: userProfile.nama,
      description: 'Nama lengkap terdaftar'
    },
    {
      icon: Mail,
      label: 'Email',
      value: userProfile.email,
      description: 'Alamat email resmi'
    },
    {
      icon: Phone,
      label: 'Nomor Telepon',
      value: userProfile.telepon,
      description: 'Nomor kontak terdaftar'
    }
  ];

  const getStatusBadge = (status) => {
    if (status === 'approved') {
      return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"><CheckCircle className="w-3 h-3" /> Disetujui</span>;
    } else if (status === 'pending') {
      return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"><Clock className="w-3 h-3" /> Menunggu</span>;
    } else if (status === 'rejected') {
      return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"><XCircle className="w-3 h-3" /> Ditolak</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">-</span>;
  };

  const getAplikasiBadge = (aplikasi) => {
    const colorMap = {
      'APOLO': 'bg-red-100 text-red-800 border-red-200',
      'Ereporting': 'bg-blue-100 text-blue-800 border-blue-200',
      'SIPINA': 'bg-green-100 text-green-800 border-green-200',
    };
    
    const iconMap = {
      'APOLO': <Package className="w-3 h-3" />,
      'Ereporting': <Database className="w-3 h-3" />,
      'SIPINA': <FileText className="w-3 h-3" />,
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${colorMap[aplikasi]}`}>
        {iconMap[aplikasi]}
        {aplikasi}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Informasi Pengguna</h1>
          {/* <p className="text-red-600 font-medium">Informasi Profil Terdaftar</p> */}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-6">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Informasi Profil</h2>
                <p className="text-white/90 text-sm mt-1">Data lengkap pengguna IRS</p>
              </div>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {profileItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={index}
                    className="group transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                        <Icon className="w-5 h-5 text-red-600" />
                      </div>
                      <label className="text-sm font-semibold text-gray-700">
                        {item.label}
                      </label>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-xl border border-red-100 
                                   group-hover:border-red-300 group-hover:shadow-md transition-all">
                      <p className="text-xl font-bold text-gray-900 mb-1">
                        {item.value}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Validasi Data dari Pengajuan Hak Akses */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800">Validasi Data</p>
                  <p className="text-sm text-blue-700">
                    Profil ini telah divalidasi berdasarkan Data Pengajuan Hak Akses yang diajukan melalui sistem Management Account IRS.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    *Data profil terintegrasi dengan sistem pengajuan hak akses aplikasi
                  </p>
                </div>
              </div>
            </div>

            {/* Hak Akses Aplikasi Table */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Eye className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Peran Pengguna</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-xl">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">No</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Aplikasi</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Nama Peran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {hakAksesData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-4 py-3">
                          {getAplikasiBadge(item.aplikasi)}
                        </td>
                        <td className="px-4 py-3">
                          {item.isARO && item.aroList ? (
                            <div className="flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full w-fit">
                                <Package className="w-3 h-3" />
                                {item.modul}
                              </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.aroList.map((aro, idx) => (
                                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full border border-purple-200">
                                    <Layers className="w-3 h-3" />
                                    {aro}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : item.modul !== '-' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              <FileText className="w-3 h-3" />
                              {item.modul}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Data diperbarui terakhir: {new Date().toLocaleDateString('id-ID')}
                </p>
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-xl border border-red-100">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">Status: Aktif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProfile;