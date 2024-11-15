import { ENDPOINTS } from "../../config/config";
import { fetchWithRetry, validateResponse, handleApiError } from "../utils/apiUtils";
import { ApiResponse } from "../../types/types";
import { Category } from "../../types/types";

export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetchWithRetry<Category[]>(ENDPOINTS.categories);
    const categories = validateResponse(response);

    return categories.map((category: Category) => category.name);
  } catch (error) {
    return handleApiError(error);
  }
};
