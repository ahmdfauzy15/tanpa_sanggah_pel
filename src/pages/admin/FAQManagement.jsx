// src/pages/admin/FAQManagement.jsx

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ChevronDown, 
  ChevronUp,
  Bold,
  Italic,
  List,
  Heading1,
  AlignLeft,
  Eye,
  EyeOff,
  GripVertical,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Eye as PreviewIcon,
  Code,
  Type,
  Image as ImageIcon,
  Youtube,
  Link as LinkIcon
} from 'lucide-react';

const FAQManagement = () => {
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaType, setMediaType] = useState('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaCaption, setMediaCaption] = useState('');

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: ''
  });

  const [faqForm, setFaqForm] = useState({
    categoryId: '',
    question: '',
    answer: '',
    isActive: true
  });

  // Load data dari localStorage
  useEffect(() => {
    loadCategories();
    loadFaqs();
  }, []);

  const loadCategories = () => {
    const savedCategories = localStorage.getItem('faq_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      const defaultCategories = [
        { id: 'gen001', name: 'Umum', description: 'Pertanyaan umum tentang sistem IRS', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'apo001', name: 'APOLO', description: 'Pertanyaan terkait modul APOLO', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'ere001', name: 'E-Reporting', description: 'Pertanyaan terkait E-Reporting', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'sip001', name: 'SIPINA', description: 'Pertanyaan terkait SIPINA', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: 'tec001', name: 'Teknis', description: 'Pertanyaan teknis dan troubleshooting', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('faq_categories', JSON.stringify(defaultCategories));
    }
  };

  const loadFaqs = () => {
    const savedFaqs = localStorage.getItem('faq_items');
    if (savedFaqs) {
      setFaqs(JSON.parse(savedFaqs));
    } else {
      const defaultFaqs = [
        {
          id: '1',
          categoryId: 'gen001',
          question: 'Apa itu Sistem Pelaporan Terpusat IRS?',
          answer: 'Sistem Pelaporan Terpusat IRS adalah platform terintegrasi untuk mengelola berbagai laporan keuangan dan operasional dalam satu sistem. Termasuk modul <strong>APOLO</strong>, <strong>E-Reporting</strong>, dan <strong>SIPINA</strong>.',
          order: 1,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Admin',
          updatedBy: 'Admin'
        },
        {
          id: '2',
          categoryId: 'apo001',
          question: 'Bagaimana cara mengirim laporan APOLO?',
          answer: '<ol><li>Masuk ke halaman Laporan APOLO</li><li>Klik tombol "Tambah Laporan"</li><li>Isi formulir dengan data yang diperlukan</li><li>Unggah dokumen pendukung</li><li>Klik "Kirim" untuk mengajukan laporan</li></ol>',
          order: 2,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Admin',
          updatedBy: 'Admin'
        },
        {
          id: '3',
          categoryId: 'ere001',
          question: 'Kapan deadline pelaporan E-Reporting?',
          answer: 'Deadline pelaporan E-Reporting adalah setiap tanggal <strong>10 bulan berikutnya</strong>. Pastikan laporan disampaikan tepat waktu untuk menghindari sanksi.',
          order: 3,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Admin',
          updatedBy: 'Admin'
        },
        {
          id: '4',
          categoryId: 'sip001',
          question: 'Cara menggunakan fitur pelaporan?',
          answer: 'Berikut adalah video tutorial cara menggunakan fitur pelaporan:<br/><br/><div class="video-wrapper"><iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><br/>Atau lihat gambar panduan di bawah ini:<br/><img src="https://via.placeholder.com/800x400?text=Panduan+Pelaporan" alt="Panduan Pelaporan" class="rounded-lg shadow-md my-2" />',
          order: 4,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Admin',
          updatedBy: 'Admin'
        },
        {
          id: '5',
          categoryId: 'tec001',
          question: 'Bagaimana cara reset password?',
          answer: 'Klik "Lupa Password" di halaman login, masukkan email terdaftar, dan ikuti instruksi yang dikirim ke email Anda.',
          order: 5,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Admin',
          updatedBy: 'Admin'
        },
        {
          id: '6',
          categoryId: 'gen001',
          question: 'Apakah sistem IRS tersedia 24/7?',
          answer: 'Ya, sistem IRS dapat diakses 24/7 untuk pelaporan. Dukungan teknis tersedia pada jam kerja <em>Senin-Jumat 08:00-17:00</em>.',
          order: 6,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Admin',
          updatedBy: 'Admin'
        }
      ];
      setFaqs(defaultFaqs);
      localStorage.setItem('faq_items', JSON.stringify(defaultFaqs));
    }
  };

  const saveCategories = (newCategories) => {
    setCategories(newCategories);
    localStorage.setItem('faq_categories', JSON.stringify(newCategories));
  };

  const saveFaqs = (newFaqs) => {
    setFaqs(newFaqs);
    localStorage.setItem('faq_items', JSON.stringify(newFaqs));
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Category CRUD
  const handleAddCategory = () => {
    if (!categoryForm.name.trim()) {
      alert('Nama kategori harus diisi');
      return;
    }

    const newCategory = {
      id: `cat_${Date.now()}`,
      name: categoryForm.name,
      description: categoryForm.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    saveCategories([...categories, newCategory]);
    setCategoryForm({ name: '', description: '' });
    setShowCategoryModal(false);
    showSuccess('Kategori berhasil ditambahkan');
  };

  const handleUpdateCategory = () => {
    if (!categoryForm.name.trim()) return;

    const updatedCategories = categories.map(cat =>
      cat.id === editingCategory.id
        ? { ...cat, name: categoryForm.name, description: categoryForm.description, updatedAt: new Date().toISOString() }
        : cat
    );

    saveCategories(updatedCategories);
    setCategoryForm({ name: '', description: '' });
    setEditingCategory(null);
    setShowCategoryModal(false);
    showSuccess('Kategori berhasil diupdate');
  };

  const handleDeleteCategory = (categoryId) => {
    const hasFAQs = faqs.some(faq => faq.categoryId === categoryId && faq.isActive !== false);
    if (hasFAQs) {
      alert('Tidak dapat menghapus kategori yang masih memiliki FAQ aktif');
      return;
    }

    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      const updatedCategories = categories.filter(cat => cat.id !== categoryId);
      saveCategories(updatedCategories);
      
      const umumCategory = categories.find(cat => cat.name === 'Umum');
      if (umumCategory) {
        const updatedFaqs = faqs.map(faq =>
          faq.categoryId === categoryId ? { ...faq, categoryId: umumCategory.id } : faq
        );
        saveFaqs(updatedFaqs);
      }
      
      showSuccess('Kategori berhasil dihapus');
    }
  };

  // FAQ CRUD
  const handleAddFAQ = () => {
    if (!faqForm.categoryId || !faqForm.question.trim() || !faqForm.answer.trim()) {
      alert('Semua field harus diisi');
      return;
    }

    // Process answer: convert line breaks to <br/> tags if not already HTML
    let processedAnswer = faqForm.answer;
    if (!/<[^>]*>/.test(processedAnswer)) {
      processedAnswer = processedAnswer.replace(/\n/g, '<br/>');
    }

    const newFAQ = {
      id: `faq_${Date.now()}`,
      ...faqForm,
      answer: processedAnswer,
      order: faqs.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Admin',
      updatedBy: 'Admin'
    };

    saveFaqs([...faqs, newFAQ]);
    setFaqForm({ categoryId: '', question: '', answer: '', isActive: true });
    setShowFAQModal(false);
    showSuccess('FAQ berhasil ditambahkan');
  };

  const handleUpdateFAQ = () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    // Process answer: convert line breaks to <br/> tags if not already HTML
    let processedAnswer = faqForm.answer;
    if (!/<[^>]*>/.test(processedAnswer)) {
      processedAnswer = processedAnswer.replace(/\n/g, '<br/>');
    }

    const updatedFaqs = faqs.map(faq =>
      faq.id === editingFAQ.id
        ? { ...faq, ...faqForm, answer: processedAnswer, updatedAt: new Date().toISOString(), updatedBy: 'Admin' }
        : faq
    );

    saveFaqs(updatedFaqs);
    setFaqForm({ categoryId: '', question: '', answer: '', isActive: true });
    setEditingFAQ(null);
    setShowFAQModal(false);
    showSuccess('FAQ berhasil diupdate');
  };

  const handleDeleteFAQ = (faqId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus FAQ ini?')) {
      const updatedFaqs = faqs.filter(faq => faq.id !== faqId);
      saveFaqs(updatedFaqs);
      showSuccess('FAQ berhasil dihapus');
    }
  };

  const handleToggleActive = (faqId) => {
    const updatedFaqs = faqs.map(faq =>
      faq.id === faqId ? { ...faq, isActive: !faq.isActive, updatedAt: new Date().toISOString() } : faq
    );
    saveFaqs(updatedFaqs);
    showSuccess('Status FAQ berhasil diubah');
  };

  const handleMoveOrder = (faqId, direction) => {
    const filteredFaqs = getFilteredFaqs();
    const currentIndex = filteredFaqs.findIndex(f => f.id === faqId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= filteredFaqs.length) return;

    const newOrder = [...filteredFaqs];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    
    const updatedFaqs = faqs.map(faq => {
      const newOrderItem = newOrder.find(o => o.id === faq.id);
      if (newOrderItem) {
        return { ...faq, order: newOrder.indexOf(newOrderItem) + 1 };
      }
      return faq;
    });
    
    saveFaqs(updatedFaqs);
  };

  const getFilteredFaqs = () => {
    let filtered = faqs.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.categoryId === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = showDeleted ? faq.isActive === false : faq.isActive === true;
      return matchesCategory && matchesSearch && matchesStatus;
    });
    
    return filtered.sort((a, b) => a.order - b.order);
  };

  const openEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description });
    setShowCategoryModal(true);
  };

  const openEditFAQ = (faq) => {
    setEditingFAQ(faq);
    setFaqForm({
      categoryId: faq.categoryId,
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive
    });
    setPreviewMode(false);
    setShowFAQModal(true);
  };

  // Function to insert image or video
  const insertMedia = () => {
    if (!mediaUrl) {
      alert('Masukkan URL gambar atau video YouTube');
      return;
    }

    let mediaHtml = '';
    
    if (mediaType === 'image') {
      mediaHtml = `<div class="media-container my-4">
        <img src="${mediaUrl}" alt="${mediaCaption || 'Gambar'}" class="rounded-lg shadow-md max-w-full h-auto" />
        ${mediaCaption ? `<p class="text-sm text-gray-500 mt-2 text-center">${mediaCaption}</p>` : ''}
      </div>`;
    } else if (mediaType === 'youtube') {
      // Extract YouTube video ID
      let videoId = mediaUrl;
      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
      const match = mediaUrl.match(youtubeRegex);
      if (match) {
        videoId = match[1];
      }
      mediaHtml = `<div class="video-wrapper my-4 relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-md">
        <iframe 
          class="absolute top-0 left-0 w-full h-full"
          src="https://www.youtube.com/embed/${videoId}" 
          title="${mediaCaption || 'YouTube Video'}"
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
        ${mediaCaption ? `<p class="text-sm text-gray-500 mt-2 text-center">${mediaCaption}</p>` : ''}
      </div>`;
    }

    const textarea = document.getElementById('faqAnswer');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newAnswer = faqForm.answer.substring(0, start) + mediaHtml + faqForm.answer.substring(end);
      setFaqForm({ ...faqForm, answer: newAnswer });
      
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + mediaHtml.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 10);
    }
    
    setShowMediaModal(false);
    setMediaUrl('');
    setMediaCaption('');
  };

  // Rich text editor helpers
  const insertFormatting = (type) => {
    const textarea = document.getElementById('faqAnswer');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = faqForm.answer.substring(start, end);
    
    let wrappedText = '';
    let cursorOffset = 0;
    
    switch(type) {
      case 'bold':
        wrappedText = `<strong>${selectedText || 'teks tebal'}</strong>`;
        cursorOffset = wrappedText.length;
        break;
      case 'italic':
        wrappedText = `<em>${selectedText || 'teks miring'}</em>`;
        cursorOffset = wrappedText.length;
        break;
      case 'underline':
        wrappedText = `<u>${selectedText || 'teks garis bawah'}</u>`;
        cursorOffset = wrappedText.length;
        break;
      case 'list':
        if (selectedText) {
          const items = selectedText.split('\n');
          wrappedText = `<ul class="list-disc ml-6 my-2">\n${items.map(item => `  <li>${item}</li>`).join('\n')}\n</ul>`;
        } else {
          wrappedText = `<ul class="list-disc ml-6 my-2">\n  <li>item list</li>\n</ul>`;
        }
        cursorOffset = wrappedText.length;
        break;
      case 'numbered-list':
        if (selectedText) {
          const items = selectedText.split('\n');
          wrappedText = `<ol class="list-decimal ml-6 my-2">\n${items.map(item => `  <li>${item}</li>`).join('\n')}\n</ol>`;
        } else {
          wrappedText = `<ol class="list-decimal ml-6 my-2">\n  <li>item list</li>\n</ol>`;
        }
        cursorOffset = wrappedText.length;
        break;
      case 'line-break':
        wrappedText = `<br/>\n`;
        cursorOffset = wrappedText.length;
        break;
      case 'paragraph':
        wrappedText = `<p class="my-2">${selectedText || 'paragraf baru'}</p>\n`;
        cursorOffset = wrappedText.length;
        break;
      default:
        return;
    }
    
    const newAnswer = faqForm.answer.substring(0, start) + wrappedText + faqForm.answer.substring(end);
    setFaqForm({ ...faqForm, answer: newAnswer });
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + cursorOffset;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  // Function to render HTML preview with media support
  const renderPreview = (htmlContent) => {
    return { __html: htmlContent || '<em class="text-gray-400">Tidak ada konten</em>' };
  };

  const filteredFaqs = getFilteredFaqs();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-red-900">Manajemen FAQ</h1>
              <p className="text-red-600 mt-1">Kelola pertanyaan dan jawaban untuk Help Center</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setCategoryForm({ name: '', description: '' });
                  setShowCategoryModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kategori</span>
              </button>
              <button
                onClick={() => {
                  setEditingFAQ(null);
                  setFaqForm({ categoryId: selectedCategory !== 'all' ? selectedCategory : '', question: '', answer: '', isActive: true });
                  setPreviewMode(false);
                  setShowFAQModal(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah FAQ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-red-100 shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-400" />
              <input
                type="text"
                placeholder="Cari FAQ..."
                className="w-full pl-10 pr-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                showDeleted 
                  ? 'bg-red-100 text-red-700 border border-red-300' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}
            >
              <EyeOff className="w-4 h-4" />
              <span>{showDeleted ? 'Tampilkan Aktif' : 'Tampilkan Tidak Aktif'}</span>
            </button>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2 text-red-600" />
            Daftar Kategori
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(category => (
              <div key={category.id} className="bg-white rounded-xl border border-red-100 shadow-md p-4 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-red-900">{category.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => openEditCategory(category)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4 text-red-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{category.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {faqs.filter(f => f.categoryId === category.id && f.isActive).length} FAQ aktif
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs Table */}
        <div>
          <h2 className="text-lg font-bold text-red-900 mb-4">Daftar FAQ</h2>
          <div className="bg-white rounded-xl border border-red-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-50 to-white border-b border-red-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase">Urutan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase">Kategori</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase">Pertanyaan</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-red-700 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {filteredFaqs.map((faq, index) => {
                    const category = categories.find(c => c.id === faq.categoryId);
                    return (
                      <tr key={faq.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleMoveOrder(faq.id, 'up')}
                              disabled={index === 0}
                              className="p-1 hover:bg-red-100 rounded disabled:opacity-30"
                            >
                              <ChevronUp className="w-4 h-4 text-red-600" />
                            </button>
                            <button
                              onClick={() => handleMoveOrder(faq.id, 'down')}
                              disabled={index === filteredFaqs.length - 1}
                              className="p-1 hover:bg-red-100 rounded disabled:opacity-30"
                            >
                              <ChevronDown className="w-4 h-4 text-red-600" />
                            </button>
                            <span className="text-sm text-gray-500 ml-2">{faq.order}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                            {category?.name || 'Tidak ada kategori'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="max-w-md">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{faq.question}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleActive(faq.id)}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              faq.isActive
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {faq.isActive ? 'Aktif' : 'Tidak Aktif'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditFAQ(faq)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <Edit className="w-4 h-4 text-red-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteFAQ(faq.id)}
                              className="p-1 hover:bg-red-100 rounded"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-2" />
                <p className="text-gray-500">Tidak ada FAQ yang ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-red-100">
              <h3 className="text-lg font-bold text-red-900">
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                />
              </div>
            </div>
            <div className="p-6 border-t border-red-100 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                  setCategoryForm({ name: '', description: '' });
                }}
                className="px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={editingCategory ? handleUpdateCategory : handleAddCategory}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {editingCategory ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Insert Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-red-100">
              <h3 className="text-lg font-bold text-red-900">Tambah Media</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Media</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setMediaType('image')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      mediaType === 'image'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Gambar
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaType('youtube')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                      mediaType === 'youtube'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Youtube className="w-4 h-4" />
                    YouTube
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {mediaType === 'image' ? 'URL Gambar *' : 'URL YouTube *'}
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={mediaType === 'image' ? 'https://example.com/gambar.jpg' : 'https://youtube.com/watch?v=...'}
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {mediaType === 'image' 
                    ? 'Masukkan URL gambar (jpg, png, gif, dll)' 
                    : 'Masukkan link YouTube (bisa berupa watch?v= atau youtu.be)'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption (opsional)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Keterangan gambar/video"
                  value={mediaCaption}
                  onChange={(e) => setMediaCaption(e.target.value)}
                />
              </div>
              {mediaType === 'youtube' && mediaUrl && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <div className="relative pb-[56.25%] h-0 rounded overflow-hidden">
                    <iframe 
                      className="absolute top-0 left-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${mediaUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1] || ''}`}
                      title="Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-red-100 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowMediaModal(false);
                  setMediaUrl('');
                  setMediaCaption('');
                }}
                className="px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={insertMedia}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Insert Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal with Rich Text Editor & Preview */}
      {showFAQModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-red-100 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-red-900">
                  {editingFAQ ? 'Edit FAQ' : 'Tambah FAQ Baru'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      previewMode 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {previewMode ? <Code className="w-4 h-4" /> : <PreviewIcon className="w-4 h-4" />}
                    {previewMode ? 'Edit Mode' : 'Preview Mode'}
                  </button>
                </div>
              </div>
            </div>
            
            {!previewMode ? (
              // EDIT MODE
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                  <select
                    className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={faqForm.categoryId}
                    onChange={(e) => setFaqForm({ ...faqForm, categoryId: e.target.value })}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan *</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban *</label>
                  <div className="border border-red-200 rounded-lg overflow-hidden">
                    <div className="flex flex-wrap gap-1 p-2 bg-red-50 border-b border-red-200">
                      <button
                        type="button"
                        onClick={() => insertFormatting('bold')}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Bold (teks tebal)"
                      >
                        <Bold className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('italic')}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Italic (teks miring)"
                      >
                        <Italic className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('underline')}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Underline (garis bawah)"
                      >
                        <u className="w-4 h-4 text-red-600 font-bold">U</u>
                      </button>
                      <div className="w-px h-6 bg-red-200 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => insertFormatting('list')}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Bullet List (poin-poin)"
                      >
                        <List className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('numbered-list')}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Numbered List (daftar bernomor)"
                      >
                        <Heading1 className="w-4 h-4 text-red-600" />
                      </button>
                      <div className="w-px h-6 bg-red-200 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => insertFormatting('line-break')}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Line Break (baris baru)"
                      >
                        <AlignLeft className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('paragraph')}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Paragraph (paragraf)"
                      >
                        <Type className="w-4 h-4 text-red-600" />
                      </button>
                      <div className="w-px h-6 bg-red-200 mx-1"></div>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaType('image');
                          setMediaUrl('');
                          setMediaCaption('');
                          setShowMediaModal(true);
                        }}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Insert Image"
                      >
                        <ImageIcon className="w-4 h-4 text-red-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMediaType('youtube');
                          setMediaUrl('');
                          setMediaCaption('');
                          setShowMediaModal(true);
                        }}
                        className="p-1.5 hover:bg-white rounded transition-colors"
                        title="Insert YouTube Video"
                      >
                        <Youtube className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                    <textarea
                      id="faqAnswer"
                      rows="12"
                      className="w-full px-3 py-2 focus:outline-none font-mono text-sm"
                      value={faqForm.answer}
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                      placeholder="Tulis jawaban di sini. Gunakan tombol formatting di atas untuk memperkaya teks...&#10;&#10;Contoh:&#10;&lt;strong&gt;Teks Tebal&lt;/strong&gt;&#10;&lt;em&gt;Teks Miring&lt;/em&gt;&#10;&lt;ul&gt;&lt;li&gt;Item 1&lt;/li&gt;&lt;li&gt;Item 2&lt;/li&gt;&lt;/ul&gt;&#10;&lt;ol&gt;&lt;li&gt;Langkah 1&lt;/li&gt;&lt;li&gt;Langkah 2&lt;/li&gt;&lt;/ol&gt;&#10;&#10;Untuk menambahkan gambar atau video, klik tombol 🖼️ atau 📺 di atas!"
                    />
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700 font-medium mb-1">💡 Tips Formatting:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                      <div><code className="bg-blue-100 px-1 rounded">&lt;strong&gt;teks&lt;/strong&gt;</code> → <strong>teks tebal</strong></div>
                      <div><code className="bg-blue-100 px-1 rounded">&lt;em&gt;teks&lt;/em&gt;</code> → <em>teks miring</em></div>
                      <div><code className="bg-blue-100 px-1 rounded">&lt;u&gt;teks&lt;/u&gt;</code> → <u>teks garis bawah</u></div>
                      <div><code className="bg-blue-100 px-1 rounded">&lt;br/&gt;</code> → baris baru</div>
                      <div><code className="bg-blue-100 px-1 rounded">&lt;ul&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ul&gt;</code> → bullet list</div>
                      <div><code className="bg-blue-100 px-1 rounded">&lt;ol&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ol&gt;</code> → numbered list</div>
                      <div><code className="bg-blue-100 px-1 rounded">&lt;img src="url" /&gt;</code> → gambar</div>
                      <div><code className="bg-blue-100 px-1 rounded">&lt;iframe src="youtube"&gt;</code> → video YouTube</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    className="w-4 h-4 text-red-600 rounded border-red-300 focus:ring-red-500"
                    checked={faqForm.isActive}
                    onChange={(e) => setFaqForm({ ...faqForm, isActive: e.target.checked })}
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Aktifkan FAQ ini
                  </label>
                </div>
              </div>
            ) : (
              // PREVIEW MODE
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview Kategori:</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                      {categories.find(c => c.id === faqForm.categoryId)?.name || 'Belum dipilih'}
                    </span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview Pertanyaan:</label>
                  <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-bold text-red-900">{faqForm.question || '<belum diisi>'}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview Jawaban:</label>
                  <div className="p-4 bg-gradient-to-r from-red-50 to-white rounded-lg border border-red-200">
                    <div 
                      className="text-sm text-red-700 leading-relaxed prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={renderPreview(faqForm.answer)}
                    />
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-6 border-t border-red-100 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowFAQModal(false);
                  setEditingFAQ(null);
                  setFaqForm({ categoryId: '', question: '', answer: '', isActive: true });
                  setPreviewMode(false);
                }}
                className="px-4 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={editingFAQ ? handleUpdateFAQ : handleAddFAQ}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all"
              >
                {editingFAQ ? 'Update' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQManagement;