import { BASE_URL } from "../../config/config";
import { fetchWithRetry, validateResponse, handleApiError } from "../utils/apiUtils";

interface LessonText {
  id: string;
  text: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  preAmble: string;
  text: LessonText[];
  order?: string;
}

// Get a specific lesson
export const getLesson = async (courseSlug: string, lessonSlug: string): Promise<Lesson> => {
  try {
    const response = await fetchWithRetry<Lesson>(`${BASE_URL}/courses/${courseSlug}/${lessonSlug}`);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Update a lesson
export const updateLesson = async (courseSlug: string, lessonSlug: string, data: Partial<Lesson>): Promise<Lesson> => {
  try {
    const response = await fetchWithRetry<Lesson>(`${BASE_URL}/courses/${courseSlug}/lessons/${lessonSlug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a lesson
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
