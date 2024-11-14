import { BASE_URL } from "../../config/config";
import { fetchWithRetry, validateResponse, handleApiError } from "../utils/apiUtils";
import { Lesson } from "@/types/types";

export const getLesson = async (courseSlug: string, lessonSlug: string): Promise<Lesson> => {
  try {
    const response = await fetchWithRetry<Lesson>(`${BASE_URL}/courses/${courseSlug}/${lessonSlug}`);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateLesson = async (courseSlug: string, lessonSlug: string, data: Partial<Lesson>): Promise<Lesson> => {
  try {
    const formattedData = {
      ...data,
      text: Array.isArray(data.text) ? data.text : [{ id: '1', text: data.text }]
    };

    const response = await fetchWithRetry<Lesson>(`${BASE_URL}/courses/${courseSlug}/lessons/${lessonSlug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteLesson = async (courseSlug: string, lessonSlug: string): Promise<void> => {
  try {
    const response = await fetchWithRetry<void>(`${BASE_URL}/courses/${courseSlug}/lessons/${lessonSlug}`, {
      method: 'DELETE',
    });
    validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};
