import { v4 as uuidv4 } from 'uuid';
import { FormState, FormAction } from '../types/types';

export const initialState: FormState = {
  courseFields: {
    id: uuidv4(),
    title: '',
    slug: '',
    description: '',
    category: '',
  },
  lessons: [],
  currentStep: 0,
  currentLesson: 0,
  errors: {},
  status: 'idle',
};

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_COURSE_FIELD':
      return {
        ...state,
        courseFields: {
          ...state.courseFields,
          [action.field]: action.value,
        },
      };

    case 'SET_LESSON_FIELD':
      return {
        ...state,
        lessons: state.lessons.map((lesson, index) =>
          index === action.index
            ? { ...lesson, [action.field]: action.value }
            : lesson
        ),
      };

    case 'SET_LESSON_TEXT':
      return {
        ...state,
        lessons: state.lessons.map((lesson, index) =>
          index === action.index
            ? {
                ...lesson,
                text: [{
                  id: lesson.text[0]?.id || uuidv4(),
                  text: action.value,
                }],
              }
            : lesson
        ),
      };

    case 'ADD_LESSON':
      return {
        ...state,
        lessons: [
          ...state.lessons,
          {
            id: uuidv4(),
            title: '',
            slug: '',
            preAmble: '',
            text: [{
              id: uuidv4(),
              text: '',
            }],
            order: `${state.lessons.length}`,
          },
        ],
        currentLesson: state.lessons.length,
      };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.step,
      };

    case 'SET_CURRENT_LESSON':
      return {
        ...state,
        currentLesson: action.lesson,
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.field]: action.message,
        },
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: {},
      };

    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
        message: action.message,
      };

    case 'RESET_FORM':
      return initialState;

    default:
      return state;
  }
}

export function validateForm(state: FormState): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validate course fields
  if (state.currentStep === 0) {
    if (!state.courseFields.title) {
      errors.title = 'Tittel er påkrevd';
    }
    if (!state.courseFields.slug) {
      errors.slug = 'Slug er påkrevd';
    }
    if (!state.courseFields.description) {
      errors.description = 'Beskrivelse er påkrevd';
    }
    if (!state.courseFields.category) {
      errors.category = 'Kategori er påkrevd';
    }
  }

  // Validate lesson fields
  if (state.currentStep === 1 && state.lessons.length > 0) {
    const currentLesson = state.lessons[state.currentLesson];
    if (!currentLesson.title) {
      errors.title = 'Leksjonstittel er påkrevd';
    }
    if (!currentLesson.slug) {
      errors.slug = 'Slug er påkrevd';
    }
    if (!currentLesson.preAmble) {
      errors.preAmble = 'Ingress er påkrevd';
    }
    if (!currentLesson.text[0]?.text) {
      errors.text = 'Innhold er påkrevd';
    }
  }

  return errors;
}
