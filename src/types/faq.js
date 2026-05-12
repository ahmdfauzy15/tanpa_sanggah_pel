// src/types/faq.js

export const FAQCategory = {
  id: 'string',
  name: 'string',
  description: 'string',
  createdAt: 'string',
  updatedAt: 'string'
};

export const FAQItem = {
  id: 'string',
  categoryId: 'string',
  question: 'string',
  answer: 'string',
  order: 'number',
  isActive: 'boolean',
  createdAt: 'string',
  updatedAt: 'string',
  createdBy: 'string',
  updatedBy: 'string'
};

// Default data untuk pertama kali load
export const DEFAULT_CATEGORIES = [
  { 
    id: 'cat_gen_001', 
    name: 'Umum', 
    description: 'Pertanyaan umum tentang sistem IRS',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat_apo_001', 
    name: 'APOLO', 
    description: 'Pertanyaan terkait modul APOLO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat_ere_001', 
    name: 'E-Reporting', 
    description: 'Pertanyaan terkait E-Reporting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat_sip_001', 
    name: 'SIPINA', 
    description: 'Pertanyaan terkait SIPINA',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 'cat_tec_001', 
    name: 'Teknis', 
    description: 'Pertanyaan teknis dan troubleshooting',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const DEFAULT_FAQS = [
  {
    id: 'faq_001',
    categoryId: 'cat_gen_001',
    question: 'Apa itu Sistem Pelaporan Terpusat IRS?',
    answer: 'Sistem Pelaporan Terpusat IRS adalah platform terintegrasi untuk mengelola berbagai laporan keuangan dan operasional dalam satu sistem. Termasuk modul <strong>APOLO</strong>, <strong>E-Reporting</strong>, dan <strong>SIPINA</strong>.',
    order: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 'faq_002',
    categoryId: 'cat_apo_001',
    question: 'Bagaimana cara mengirim laporan APOLO?',
    answer: '<ol><li>Masuk ke halaman Laporan APOLO</li><li>Klik tombol "Tambah Laporan"</li><li>Isi formulir dengan data yang diperlukan</li><li>Unggah dokumen pendukung</li><li>Klik "Kirim" untuk mengajukan laporan</li></ol>',
    order: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 'faq_003',
    categoryId: 'cat_ere_001',
    question: 'Kapan deadline pelaporan E-Reporting?',
    answer: 'Deadline pelaporan E-Reporting adalah setiap tanggal <strong>10 bulan berikutnya</strong>. Pastikan laporan disampaikan tepat waktu untuk menghindari sanksi.',
    order: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 'faq_004',
    categoryId: 'cat_sip_001',
    question: 'Apa yang harus dilakukan jika laporan SIPINA ditolak?',
    answer: 'Periksa notifikasi penolakan, perbaiki data sesuai arahan, dan kirim ulang laporan. Sistem akan memberikan petunjuk revisi yang diperlukan.',
    order: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 'faq_005',
    categoryId: 'cat_tec_001',
    question: 'Bagaimana cara reset password?',
    answer: 'Klik "Lupa Password" di halaman login, masukkan email terdaftar, dan ikuti instruksi yang dikirim ke email Anda.',
    order: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  },
  {
    id: 'faq_006',
    categoryId: 'cat_gen_001',
    question: 'Apakah sistem IRS tersedia 24/7?',
    answer: 'Ya, sistem IRS dapat diakses 24/7 untuk pelaporan. Dukungan teknis tersedia pada jam kerja <em>Senin-Jumat 08:00-17:00</em>.',
    order: 6,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'System',
    updatedBy: 'System'
  }
];