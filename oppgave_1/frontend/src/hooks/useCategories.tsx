import { useState, useEffect } from 'react';
import { getCategories } from '../lib/services/categories';

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const fetchCategories = async () => {
      if (!mounted) return;

      try {
        setLoading(true);
        setError(null);
        console.log('Starting categories fetch, attempt:', retryCount + 1);
        
        const fetchedCategories = await getCategories();
        
        if (!mounted) return;

        console.log('Categories fetch successful:', JSON.stringify(fetchedCategories, null, 2));
        if (Array.isArray(fetchedCategories) && fetchedCategories.length > 0) {
          setCategories(fetchedCategories);
          setLoading(false);
          console.log('Categories state updated:', JSON.stringify(fetchedCategories, null, 2));
        } else {
          console.warn('Empty or invalid categories response:', JSON.stringify(fetchedCategories, null, 2));
          if (retryCount < maxRetries) {
            timeoutId = setTimeout(() => {
              setRetryCount(prev => prev + 1);
            }, 1000 * Math.pow(2, retryCount));
          } else {
            throw new Error('Failed to fetch categories after multiple attempts');
          }
        }
      } catch (error) {
        console.error('Error in useCategories:', error instanceof Error ? error.message : error);
        if (!mounted) return;

        if (retryCount < maxRetries) {
          timeoutId = setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 1000 * Math.pow(2, retryCount));
        } else {
          setError(error instanceof Error ? error : new Error('Failed to fetch categories'));
          setLoading(false);
        }
      }
    };

    fetchCategories();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [retryCount]);

  // Add isReady flag to help components know when data is available
  const isReady = !loading && !error && categories.length > 0;

  // Debug info
  useEffect(() => {
    console.log('Categories hook state:', {
      categories: JSON.stringify(categories, null, 2),
      loading,
      error: error?.message,
      isReady,
      retryCount,
      maxRetries
    });
  }, [categories, loading, error, isReady, retryCount]);

  return { 
    categories, 
    loading, 
    error,
    isReady,
    retryCount,
    maxRetries
  };
}
