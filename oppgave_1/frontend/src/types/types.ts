export interface LessonText {
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

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  lessons: Lesson[];
}

export interface CourseFields {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface LessonFields {
  id: string;
  title: string;
  preAmble: string;
  text: { id: string; text: string; }[];
  order: string;
}

export interface Category {
  id: number;  // Changed from string to number to match API response
  name: string;
}

interface CreatedBy {
  id: string | number;
  name: string;
}

interface LessonRef {
  id: string;
}

export interface Comment {
  id: string;
  createdBy: {
    id: string;
    name: string;
  };
  comment: string;
  lesson: LessonRef;
}

export interface CommentData {
  id: string;
  createdBy: CreatedBy;
  comment: string;
  lesson: LessonRef;
}

export interface PaginationMetadata {
  total: number;
  pageSize: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
  total?: number;
  pageSize?: number;
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface FormError {
  field: string;
  message: string;
}

export interface LoadingState {
  isLoading: boolean;
  status: 'idle' | 'loading' | 'success' | 'error';
}

export type FormErrors = {
  [key: string]: string | undefined;
};

export interface FormState {
  courseFields: CourseFields;
  lessons: LessonFields[];
  currentStep: number;
  currentLesson: number;
  errors: FormErrors;
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export type FormAction = 
  | { type: 'SET_COURSE_FIELD'; field: keyof CourseFields; value: string }
  | { type: 'SET_LESSON_FIELD'; index: number; field: keyof LessonFields; value: string }
  | { type: 'SET_LESSON_TEXT'; index: number; value: string }
  | { type: 'ADD_LESSON' }
  | { type: 'REMOVE_LESSON'; index: number }
  | { type: 'SET_CURRENT_STEP'; step: number }
  | { type: 'SET_CURRENT_LESSON'; lesson: number }
  | { type: 'SET_ERROR'; field: string; message: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_STATUS'; status: FormState['status']; message?: string }
  | { type: 'RESET_FORM' };

export type CreateCourseData = {
  courseFields: CourseFields;
  lessons: LessonFields[];
}
