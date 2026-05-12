// src/services/faqService.js

import { DEFAULT_CATEGORIES, DEFAULT_FAQS } from '../types/faq';

// KEYS untuk Local Storage
const STORAGE_KEYS = {
  CATEGORIES: 'faq_categories',
  FAQS: 'faq_items'
};

class FAQService {
  constructor() {
    this.initializeData();
  }

  // Inisialisasi data default jika belum ada
  initializeData() {
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAQS)) {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
    }
  }

  // ==================== CATEGORY CRUD ====================
  
  getAllCategories() {
    const categories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return JSON.parse(categories) || [];
  }

  getCategoryById(id) {
    const categories = this.getAllCategories();
    return categories.find(cat => cat.id === id);
  }

  createCategory(categoryData) {
    const categories = this.getAllCategories();
    const newCategory = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...categoryData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    categories.push(newCategory);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return newCategory;
  }

  updateCategory(id, categoryData) {
    const categories = this.getAllCategories();
    const index = categories.findIndex(cat => cat.id === id);
    
    if (index === -1) throw new Error('Category not found');
    
    categories[index] = {
      ...categories[index],
      ...categoryData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    return categories[index];
  }

  deleteCategory(id) {
    // Cek apakah ada FAQ yang menggunakan category ini
    const faqs = this.getAllFAQs();
    const hasActiveFAQs = faqs.some(faq => faq.categoryId === id && faq.isActive);
    
    if (hasActiveFAQs) {
      throw new Error('Tidak dapat menghapus kategori yang masih memiliki FAQ aktif');
    }
    
    const categories = this.getAllCategories();
    const filteredCategories = categories.filter(cat => cat.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filteredCategories));
    
    // Optional: Pindahkan FAQ orphan ke category 'Umum'
    const umumCategory = categories.find(cat => cat.name === 'Umum');
    if (umumCategory) {
      const updatedFaqs = faqs.map(faq =>
        faq.categoryId === id ? { ...faq, categoryId: umumCategory.id } : faq
      );
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(updatedFaqs));
    }
    
    return true;
  }

  // ==================== FAQ CRUD ====================
  
  getAllFAQs() {
    const faqs = localStorage.getItem(STORAGE_KEYS.FAQS);
    return JSON.parse(faqs) || [];
  }

  getActiveFAQs() {
    const faqs = this.getAllFAQs();
    return faqs.filter(faq => faq.isActive === true).sort((a, b) => a.order - b.order);
  }

  getFAQsByCategory(categoryId) {
    const faqs = this.getAllFAQs();
    return faqs.filter(faq => faq.categoryId === categoryId).sort((a, b) => a.order - b.order);
  }

  getFAQById(id) {
    const faqs = this.getAllFAQs();
    return faqs.find(faq => faq.id === id);
  }

  createFAQ(faqData) {
    const faqs = this.getAllFAQs();
    const maxOrder = Math.max(...faqs.map(f => f.order), 0);
    
    const newFAQ = {
      id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...faqData,
      order: maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Admin',
      updatedBy: 'Admin'
    };
    
    faqs.push(newFAQ);
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    return newFAQ;
  }

  updateFAQ(id, faqData) {
    const faqs = this.getAllFAQs();
    const index = faqs.findIndex(faq => faq.id === id);
    
    if (index === -1) throw new Error('FAQ not found');
    
    faqs[index] = {
      ...faqs[index],
      ...faqData,
      updatedAt: new Date().toISOString(),
      updatedBy: 'Admin'
    };
    
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
    return faqs[index];
  }

  deleteFAQ(id) {
    const faqs = this.getAllFAQs();
    const filteredFaqs = faqs.filter(faq => faq.id !== id);
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(filteredFaqs));
    return true;
  }

  toggleFAQActive(id) {
    const faq = this.getFAQById(id);
    if (!faq) throw new Error('FAQ not found');
    
    return this.updateFAQ(id, { isActive: !faq.isActive });
  }

  updateFAQOrder(faqId, newOrder) {
    const faqs = this.getAllFAQs();
    const currentFaq = faqs.find(f => f.id === faqId);
    if (!currentFaq) throw new Error('FAQ not found');
    
    // Filter FAQs with same category for ordering
    const sameCategoryFaqs = faqs.filter(f => f.categoryId === currentFaq.categoryId);
    const otherFaqs = faqs.filter(f => f.categoryId !== currentFaq.categoryId);
    
    // Reorder
    const updatedCategoryFaqs = [...sameCategoryFaqs];
    const oldIndex = updatedCategoryFaqs.findIndex(f => f.id === faqId);
    const [movedFaq] = updatedCategoryFaqs.splice(oldIndex, 1);
    updatedCategoryFaqs.splice(newOrder - 1, 0, movedFaq);
    
    // Update order numbers
    const reorderedFaqs = updatedCategoryFaqs.map((faq, idx) => ({
      ...faq,
      order: idx + 1,
      updatedAt: new Date().toISOString()
    }));
    
    const allFaqs = [...otherFaqs, ...reorderedFaqs];
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(allFaqs));
    
    return allFaqs;
  }

  // ==================== UTILITY METHODS ====================
  
  searchFAQs(keyword, categoryId = null) {
    let faqs = this.getAllFAQs();
    
    if (categoryId && categoryId !== 'all') {
      faqs = faqs.filter(faq => faq.categoryId === categoryId);
    }
    
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      faqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(lowerKeyword) ||
        faq.answer.toLowerCase().includes(lowerKeyword)
      );
    }
    
    return faqs.filter(faq => faq.isActive).sort((a, b) => a.order - b.order);
  }

  getStats() {
    const categories = this.getAllCategories();
    const faqs = this.getAllFAQs();
    const activeFaqs = faqs.filter(f => f.isActive);
    
    return {
      totalCategories: categories.length,
      totalFAQs: faqs.length,
      activeFAQs: activeFaqs.length,
      inactiveFAQs: faqs.length - activeFaqs.length,
      categoriesWithFAQs: categories.filter(cat => 
        faqs.some(f => f.categoryId === cat.id)
      ).length
    };
  }

  exportData() {
    return {
      categories: this.getAllCategories(),
      faqs: this.getAllFAQs(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    if (data.categories) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
    }
    if (data.faqs) {
      localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(data.faqs));
    }
    return true;
  }

  clearAllData() {
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.FAQS);
    this.initializeData();
    return true;
  }
}

export default new FAQService();