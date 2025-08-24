import { useState, useEffect, useCallback } from 'react';
import ApiService from '../services/ApiService';

export const useModels = (page = 0, size = 12, filters = {}) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  const loadModels = useCallback(async () => {
    // Load models implementation
  }, [page, size, filters]);

  useEffect(() => {
    loadModels();
  }, [loadModels]);

  return {
    models,
    loading,
    error,
    totalPages,
    refetch: loadModels,
  };
};
