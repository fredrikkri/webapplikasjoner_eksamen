import { Course, Lesson, CreateCourseData } from "../../types/types";
import { ENDPOINTS } from "../../config/config";
import { fetchWithRetry, validateResponse, handleApiError } from "../utils/apiUtils";

// Get categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetchWithRetry<string[]>(ENDPOINTS.categories);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a course by slug
export const getCourse = async (slug: string): Promise<Course> => {
  try {
    const response = await fetchWithRetry<Course>(`${ENDPOINTS.courses}/${slug}`);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetchWithRetry<Course[]>(ENDPOINTS.courses);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new course
export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  try {
    const response = await fetchWithRetry<Course>(ENDPOINTS.courses, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data.courseFields,
        lessons: data.lessons
      }),
    });

    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Update an existing course
export const updateCourse = async (originalSlug: string, data: Partial<Course>): Promise<Course> => {
  try {
    // Get the existing course to ensure we have all the data
    const existingCourse = await getCourse(originalSlug);
    
    // Prepare the update data, maintaining the original ID and merging with existing data
    const updateData = {
      ...existingCourse,
      ...data,
      id: originalSlug, // Use the original slug as the ID
      slug: data.slug || originalSlug, // Use new slug if provided, otherwise keep original
    };

    const response = await fetchWithRetry<Course>(`${ENDPOINTS.courses}/${originalSlug}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a course
export const deleteCourse = async (slug: string): Promise<void> => {
  try {
    const response = await fetchWithRetry<void>(`${ENDPOINTS.courses}/${slug}`, {
      method: 'DELETE',
    });

    validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get a lesson by slug
export const getLesson = async (courseSlug: string, lessonSlug: string): Promise<Lesson> => {
  try {
    const response = await fetchWithRetry<Lesson>(`${ENDPOINTS.courses}/${courseSlug}/${lessonSlug}`);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Update a lesson
export const updateLesson = async (courseSlug: string, lessonSlug: string, data: Partial<Lesson>): Promise<Lesson> => {
  try {
    const response = await fetchWithRetry<Lesson>(ENDPOINTS.lessons(courseSlug, lessonSlug), {
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
    const response = await fetchWithRetry<void>(ENDPOINTS.lessons(courseSlug, lessonSlug), {
      method: 'DELETE',
    });

    validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};
