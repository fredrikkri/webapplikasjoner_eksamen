import { Course, ApiResponse } from "../../types/types";
import { ENDPOINTS, VALIDATION_RULES, ERROR_MESSAGES } from "../../config/config";
import { fetchWithRetry, handleApiError, validateResponse } from "../utils/apiUtils";

// Validate course data against rules
export const validateCourseData = (data: Course): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validate course fields
  if (!data.title || data.title.length < VALIDATION_RULES.title.minLength) {
    errors.push(`Title must be at least ${VALIDATION_RULES.title.minLength} characters`);
  }
  if (data.title && data.title.length > VALIDATION_RULES.title.maxLength) {
    errors.push(`Title must be no more than ${VALIDATION_RULES.title.maxLength} characters`);
  }

  if (!data.slug || !VALIDATION_RULES.slug.pattern.test(data.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }
  if (data.slug && data.slug.length > VALIDATION_RULES.slug.maxLength) {
    errors.push(`Slug must be no more than ${VALIDATION_RULES.slug.maxLength} characters`);
  }

  if (!data.description || data.description.length < VALIDATION_RULES.description.minLength) {
    errors.push(`Description must be at least ${VALIDATION_RULES.description.minLength} characters`);
  }
  if (data.description && data.description.length > VALIDATION_RULES.description.maxLength) {
    errors.push(`Description must be no more than ${VALIDATION_RULES.description.maxLength} characters`);
  }

  if (!data.category || !VALIDATION_RULES.category.options.includes(data.category)) {
    errors.push('Please select a valid category');
  }

  // Validate lessons
  if (!data.lessons || data.lessons.length === 0) {
    errors.push('At least one lesson is required');
  } else {
    data.lessons.forEach((lesson, index) => {
      const lessonRules = VALIDATION_RULES.lesson;

      if (!lesson.title || lesson.title.length < lessonRules.title.minLength) {
        errors.push(`Lesson ${index + 1}: Title must be at least ${lessonRules.title.minLength} characters`);
      }
      if (lesson.title && lesson.title.length > lessonRules.title.maxLength) {
        errors.push(`Lesson ${index + 1}: Title must be no more than ${lessonRules.title.maxLength} characters`);
      }

      if (!lesson.slug || !VALIDATION_RULES.slug.pattern.test(lesson.slug)) {
        errors.push(`Lesson ${index + 1}: Slug must contain only lowercase letters, numbers, and hyphens`);
      }
      if (lesson.slug && lesson.slug.length > lessonRules.slug.maxLength) {
        errors.push(`Lesson ${index + 1}: Slug must be no more than ${lessonRules.slug.maxLength} characters`);
      }

      if (!lesson.preAmble || lesson.preAmble.length < lessonRules.preAmble.minLength) {
        errors.push(`Lesson ${index + 1}: Pre-amble must be at least ${lessonRules.preAmble.minLength} characters`);
      }
      if (lesson.preAmble && lesson.preAmble.length > lessonRules.preAmble.maxLength) {
        errors.push(`Lesson ${index + 1}: Pre-amble must be no more than ${lessonRules.preAmble.maxLength} characters`);
      }

      if (!lesson.text?.[0]?.text || lesson.text[0].text.length < lessonRules.text.minLength) {
        errors.push(`Lesson ${index + 1}: Content must be at least ${lessonRules.text.minLength} characters`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Fetch a course by slug
export const getCourse = async (slug: string): Promise<Course> => {
  try {
    const response = await fetchWithRetry<Course>(`${ENDPOINTS.courses}/${slug}`);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch all courses
export const getAllCourses = async (): Promise<Course[]> => {
  try {
    const response = await fetchWithRetry<Course[]>(ENDPOINTS.courses);
    return validateResponse(response);
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new course
export const createCourse = async (data: Course): Promise<Course> => {
  // Validate course data before making the API call
  const validation = validateCourseData(data);
  if (!validation.isValid) {
    throw new Error(validation.errors.join('\n'));
  }

  try {
    const response = await fetchWithRetry<Course>(ENDPOINTS.courses, {
      method: 'POST',
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

// Update an existing course
export const updateCourse = async (slug: string, data: Partial<Course>): Promise<Course> => {
  try {
    const response = await fetchWithRetry<Course>(`${ENDPOINTS.courses}/${slug}`, {
      method: 'PUT',
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
