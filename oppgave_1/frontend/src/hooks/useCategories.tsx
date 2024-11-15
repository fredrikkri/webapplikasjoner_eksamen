import { useState, useEffect } from 'react';
import { getCategories } from '../lib/services/categories';

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        setError(error instanceof Error ? error : new Error('Failed to fetch categories'));
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
