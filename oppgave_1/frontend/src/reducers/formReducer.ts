import { v4 as uuidv4 } from 'uuid';
import { FormState, FormAction } from '../types/types';
import { VALIDATION_RULES } from '../config/config';

export const initialState: FormState = {
  courseFields: {
    id: uuidv4(),
    title: '',
    description: '',
    category: '',
  },
  lessons: [],
  currentStep: 0,
  currentLesson: 0,
  errors: {},
  status: 'idle',
  message: '',
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
            preAmble: '',
            text: [{
              id: uuidv4(),
              text: '',
            }],
            order: `${state.lessons.length}`,
          },
        ],
        currentLesson: state.lessons.length,
        errors: {}, // Clear errors when adding new lesson
      };

    case 'REMOVE_LESSON':
      if (state.lessons.length <= 1) {
        return {
          ...state,
          currentLesson: 0,
          lessons: [],
        };
      }
      
      const newLessons = state.lessons.filter((_, index) => index !== action.index);
      return {
        ...state,
        lessons: newLessons,
        currentLesson: Math.min(state.currentLesson, newLessons.length - 1),
        errors: {}, // Clear errors when removing lesson
      };

    case 'SET_CURRENT_STEP':
      // Only validate when moving forward
      if (action.step > state.currentStep) {
        const validationErrors = validateForm({
          ...state,
          currentStep: state.currentStep // Validate current step before moving
        });

        if (Object.keys(validationErrors).length > 0) {
          return {
            ...state,
            errors: validationErrors,
          };
        }
      }

      const newStepState = {
        ...state,
        currentStep: action.step,
        errors: {},
      };

      // Show "no lessons" error immediately when entering step 2
      if (action.step === 1 && state.lessons.length === 0) {
        return {
          ...newStepState,
          errors: {
            lessons: 'Minst én leksjon er påkrevd',
          },
        };
      }

      return newStepState;

    case 'SET_CURRENT_LESSON':
      return {
        ...state,
        currentLesson: action.lesson,
        errors: {}, // Clear errors when switching lessons
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
        message: action.message || '',
      };

    case 'RESET_FORM':
      return {
        ...initialState,
        courseFields: {
          ...initialState.courseFields,
          id: uuidv4(),
        },
      };

    default:
      return state;
  }
}

function validateLessonField(
  lesson: any,
  field: string,
  index: number
): Record<string, string> {
  const errors: Record<string, string> = {};
  const lessonRules = VALIDATION_RULES.lesson;

  switch (field) {
    case 'title':
      if (!lesson.title) {
        errors[`lesson_${index}_title`] = 'Leksjonstittel er påkrevd';
      } else if (lesson.title.length < lessonRules.title.minLength) {
        errors[`lesson_${index}_title`] = `Leksjonstittel må være minst ${lessonRules.title.minLength} tegn`;
      } else if (lesson.title.length > lessonRules.title.maxLength) {
        errors[`lesson_${index}_title`] = `Leksjonstittel kan ikke være mer enn ${lessonRules.title.maxLength} tegn`;
      }
      break;

    case 'preAmble':
      if (!lesson.preAmble) {
        errors[`lesson_${index}_preAmble`] = 'Ingress er påkrevd';
      } else if (lesson.preAmble.length < lessonRules.preAmble.minLength) {
        errors[`lesson_${index}_preAmble`] = `Ingress må være minst ${lessonRules.preAmble.minLength} tegn`;
      } else if (lesson.preAmble.length > lessonRules.preAmble.maxLength) {
        errors[`lesson_${index}_preAmble`] = `Ingress kan ikke være mer enn ${lessonRules.preAmble.maxLength} tegn`;
      }
      break;

    case 'text':
      const lessonText = lesson.text[0]?.text || '';
      // Strip HTML tags for length validation
      const strippedText = lessonText.replace(/<[^>]*>/g, '').trim();
      
      if (!strippedText) {
        errors[`lesson_${index}_text`] = 'Innhold er påkrevd';
      } else if (strippedText.length < lessonRules.text.minLength) {
        errors[`lesson_${index}_text`] = `Innhold må være minst ${lessonRules.text.minLength} tegn`;
      }
      break;
  }

  return errors;
}

export function validateForm(state: FormState): Record<string, string> {
  const errors: Record<string, string> = {};

  // Validate course fields
  if (state.currentStep === 0) {
    if (!state.courseFields.title) {
      errors.title = 'Tittel er påkrevd';
    } else if (state.courseFields.title.length < VALIDATION_RULES.title.minLength) {
      errors.title = `Tittel må være minst ${VALIDATION_RULES.title.minLength} tegn`;
    } else if (state.courseFields.title.length > VALIDATION_RULES.title.maxLength) {
      errors.title = `Tittel kan ikke være mer enn ${VALIDATION_RULES.title.maxLength} tegn`;
    }

    if (!state.courseFields.description) {
      errors.description = 'Beskrivelse er påkrevd';
    } else if (state.courseFields.description.length < VALIDATION_RULES.description.minLength) {
      errors.description = `Beskrivelse må være minst ${VALIDATION_RULES.description.minLength} tegn`;
    } else if (state.courseFields.description.length > VALIDATION_RULES.description.maxLength) {
      errors.description = `Beskrivelse kan ikke være mer enn ${VALIDATION_RULES.description.maxLength} tegn`;
    }

    if (!state.courseFields.category) {
      errors.category = 'Kategori er påkrevd';
    }
  }

  // Validate lesson fields when on step 1
  if (state.currentStep === 1 && state.lessons.length > 0) {
    state.lessons.forEach((lesson, index) => {
      // Validate title
      const titleErrors = validateLessonField(lesson, 'title', index);
      Object.assign(errors, titleErrors);

      // Validate preAmble
      const preAmbleErrors = validateLessonField(lesson, 'preAmble', index);
      Object.assign(errors, preAmbleErrors);

      // Validate text
      const textErrors = validateLessonField(lesson, 'text', index);
      Object.assign(errors, textErrors);
    });
  }

  return errors;
}
