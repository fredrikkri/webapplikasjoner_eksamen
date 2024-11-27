import { ENDPOINTS } from "../../config/config";
import { fetchWithRetry } from "../utils/apiUtils";
import { ApiResponse, Category } from "../../types/types";

export const getCategories = async (): Promise<string[]> => {
  try {
    console.log('Fetching categories from:', ENDPOINTS.categories);
    const response = await fetchWithRetry<Category[]>(ENDPOINTS.categories);
    console.log('Raw API response:', JSON.stringify(response, null, 2));
    
    if (!response.success || !response.data) {
      console.error('Invalid API response:', JSON.stringify(response, null, 2));
      throw new Error(response.error?.message || 'Failed to fetch categories');
    }
    
    // Ensure we have an array of categories
    if (!Array.isArray(response.data)) {
      console.error('Expected array of categories, got:', typeof response.data, JSON.stringify(response.data, null, 2));
      throw new Error('Invalid categories data format');
    }

    // Map category names and filter out any invalid entries
    const categoryNames = response.data
      .filter(category => {
        const isValid = category && typeof category === 'object' && 'name' in category;
        if (!isValid) {
          console.warn('Invalid category entry:', JSON.stringify(category, null, 2));
        }
        return isValid;
      })
      .map(category => category.name)
      .filter(name => {
        const isValid = typeof name === 'string' && name.length > 0;
        if (!isValid) {
          console.warn('Invalid category name:', name);
        }
        return isValid;
      });

    console.log('Processed category names:', JSON.stringify(categoryNames, null, 2));

    if (categoryNames.length === 0) {
      console.warn('No valid categories found in response');
    }

    return categoryNames;
  } catch (error) {
    console.error('Error in getCategories:', error instanceof Error ? error.message : error);
    throw error;
  }
};
