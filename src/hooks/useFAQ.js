// src/hooks/useFAQ.js

import { useState, useEffect, useCallback } from 'react';
import faqService from '../services/faqService';

export const useFAQ = () => {
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Load all data
  const loadData = useCallback(() => {
    try {
      setLoading(true);
      const allCategories = faqService.getAllCategories();
      const allFaqs = faqService.getAllFAQs();
      const allStats = faqService.getStats();
      
      setCategories(allCategories);
      setFaqs(allFaqs);
      setStats(allStats);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Category operations
  const createCategory = useCallback(async (categoryData) => {
    try {
      const newCategory = faqService.createCategory(categoryData);
      setCategories(prev => [...prev, newCategory]);
      setStats(faqService.getStats());
      return { success: true, data: newCategory };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateCategory = useCallback(async (id, categoryData) => {
    try {
      const updatedCategory = faqService.updateCategory(id, categoryData);
      setCategories(prev => prev.map(cat => cat.id === id ? updatedCategory : cat));
      return { success: true, data: updatedCategory };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteCategory = useCallback(async (id) => {
    try {
      faqService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setStats(faqService.getStats());
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // FAQ operations
  const createFAQ = useCallback(async (faqData) => {
    try {
      const newFAQ = faqService.createFAQ(faqData);
      setFaqs(prev => [...prev, newFAQ]);
      setStats(faqService.getStats());
      return { success: true, data: newFAQ };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateFAQ = useCallback(async (id, faqData) => {
    try {
      const updatedFAQ = faqService.updateFAQ(id, faqData);
      setFaqs(prev => prev.map(faq => faq.id === id ? updatedFAQ : faq));
      return { success: true, data: updatedFAQ };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteFAQ = useCallback(async (id) => {
    try {
      faqService.deleteFAQ(id);
      setFaqs(prev => prev.filter(faq => faq.id !== id));
      setStats(faqService.getStats());
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const toggleFAQActive = useCallback(async (id) => {
    try {
      const updatedFAQ = faqService.toggleFAQActive(id);
      setFaqs(prev => prev.map(faq => faq.id === id ? updatedFAQ : faq));
      setStats(faqService.getStats());
      return { success: true, data: updatedFAQ };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateFAQOrder = useCallback(async (faqId, newOrder) => {
    try {
      const updatedFaqs = faqService.updateFAQOrder(faqId, newOrder);
      setFaqs(updatedFaqs);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  // Search and filter
  const searchFAQs = useCallback((keyword, categoryId = null) => {
    return faqService.searchFAQs(keyword, categoryId);
  }, []);

  const getActiveFAQs = useCallback(() => {
    return faqService.getActiveFAQs();
  }, []);

  return {
    // State
    categories,
    faqs,
    loading,
    error,
    stats,
    
    // Category operations
    createCategory,
    updateCategory,
    deleteCategory,
    
    // FAQ operations
    createFAQ,
    updateFAQ,
    deleteFAQ,
    toggleFAQActive,
    updateFAQOrder,
    
    // Utility
    searchFAQs,
    getActiveFAQs,
    refreshData: loadData
  };
};

// Hook khusus untuk user view (hanya membaca data aktif)
export const useUserFAQ = () => {
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    try {
      setLoading(true);
      const allCategories = faqService.getAllCategories();
      const activeFaqs = faqService.getActiveFAQs();
      
      setCategories(allCategories);
      setFaqs(activeFaqs);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getFAQsByCategory = useCallback((categoryId) => {
    return faqs.filter(faq => faq.categoryId === categoryId);
  }, [faqs]);

  const searchFAQs = useCallback((keyword, categoryId = null) => {
    let filtered = faqs;
    
    if (categoryId && categoryId !== 'all') {
      filtered = filtered.filter(faq => faq.categoryId === categoryId);
    }
    
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(lowerKeyword) ||
        faq.answer.toLowerCase().includes(lowerKeyword)
      );
    }
    
    return filtered;
  }, [faqs]);

  return {
    categories,
    faqs,
    loading,
    getFAQsByCategory,
    searchFAQs,
    refreshData: loadData
  };
};