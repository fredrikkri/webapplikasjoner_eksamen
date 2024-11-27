import { Course, Lesson, CreateCourseData, ApiResponse } from "../../types/types";
import { ENDPOINTS } from "../../config/config";
import { fetchWithRetry, validateResponse, handleApiError } from "../utils/apiUtils";

// Get a course by slug
export const getCourse = async (slug: string): Promise<Course> => {
  try {
    const response = await fetchWithRetry<Course>(`${ENDPOINTS.courses}/${slug}`);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Get all courses with pagination
export const getAllCourses = async (page: number = 0, pageSize: number = 9): Promise<{
  courses: Course[];
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}> => {
  try {
    console.log('Fetching courses with pagination:', { page, pageSize });
    const url = `${ENDPOINTS.courses}?page=${page}&pageSize=${pageSize}`;
    console.log('Courses API URL:', url);
    
    const response = await fetchWithRetry<Course[]>(url);
    console.log('Raw courses API response:', response);

    if (!response.success) {
      throw new Error('Failed to fetch courses');
    }

    return {
      courses: response.data,
      total: response.total || 0,
      totalPages: response.totalPages || 1,
      hasNextPage: response.hasNextPage || false,
      hasPreviousPage: response.hasPreviousPage || false
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Create a new course
export const createCourse = async (data: CreateCourseData): Promise<Course> => {
  try {
    // Transform the data to match the backend's expected structure
    const transformedData = {
      title: data.courseFields.title,
      description: data.courseFields.description,
      category: data.courseFields.category,
      lessons: data.lessons.map(lesson => ({
        title: lesson.title,
        preAmble: lesson.preAmble,
        text: lesson.text.map(t => ({
          id: t.id,
          text: t.text
        }))
      }))
    };

    const response = await fetchWithRetry<Course>(ENDPOINTS.courses, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData),
    });

    if (!response.success || !response.data) {
      throw new Error(response.error?.message || 'Failed to create course');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
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
