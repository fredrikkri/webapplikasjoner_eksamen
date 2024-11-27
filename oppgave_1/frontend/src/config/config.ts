export const BASE_URL = "http://localhost:3999/api/v1";

export const ROUTES = {
  home: "/home",
  courses: "/kurs",
  new: "/ny"
};

export const ENDPOINTS = {
  courses: `${BASE_URL}/courses`,
  categories: `${BASE_URL}/categories`,
  lessons: (courseSlug: string, lessonSlug?: string) => 
    lessonSlug 
      ? `${BASE_URL}/courses/${courseSlug}/lessons/${lessonSlug}`
      : `${BASE_URL}/courses/${courseSlug}`,
};

export const API_CONFIG = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT_ERROR: 'The request took too long to complete. Please try again.',
  SERVER_ERROR: 'An error occurred on the server. Please try again later.',
  VALIDATION_ERROR: 'Please check the form for errors and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

export const VALIDATION_RULES = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  slug: {
    required: true,
    pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    required: true,
    minLength: 10,
    maxLength: 500,
  },
  category: {
    required: true,
  },
  lesson: {
    title: {
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    slug: {
      required: true,
      pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      minLength: 3,
      maxLength: 100,
    },
    preAmble: {
      required: true,
      minLength: 10,
      maxLength: 200,
    },
    text: {
      required: true,
      minLength: 10,
    },
  },
};
