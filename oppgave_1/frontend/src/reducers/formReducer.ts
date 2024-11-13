import { v4 as uuidv4 } from 'uuid';
import { FormState, FormAction } from '../types/types';
import { VALIDATION_RULES } from '../config/config';

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
        errors: {
          ...state.errors,
          [action.field]: undefined,
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
        errors: {
          ...state.errors,
          [`lesson_${action.index}_${action.field}`]: undefined,
        },
      };

    case 'SET_LESSON_TEXT':
      return {
        ...state,
        lessons: state.lessons.map((lesson, index) =>
          index === action.index
            ? {
                ...lesson,
                text: [{
                  id: lesson.text[0]?.id || uuidv4(), // Ensure unique ID generation
                  text: action.value,
                }],
              }
            : lesson
        ),
        errors: {
          ...state.errors,
          text: undefined,
        },
      };

    case 'ADD_LESSON':
      return {
        ...state,
        lessons: [
          ...state.lessons,
          {
            id: uuidv4(), // Unique ID for each new lesson
            title: '',
            slug: '',
            preAmble: '',
            text: [{
              id: uuidv4(), // Unique ID for text within the lesson
              text: '',
            }],
            order: `${state.lessons.length}`,
          },
        ],
        currentLesson: state.lessons.length,
        errors: {},
      };

    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.step,
        errors: {},
      };

    case 'SET_CURRENT_LESSON':
      return {
        ...state,
        currentLesson: action.lesson,
        errors: {},
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

    if (!state.courseFields.slug) {
      errors.slug = 'Slug er påkrevd';
    } else if (!VALIDATION_RULES.slug.pattern.test(state.courseFields.slug)) {
      errors.slug = 'Slug kan kun inneholde små bokstaver, tall og bindestrek';
    } else if (state.courseFields.slug.length > VALIDATION_RULES.slug.maxLength) {
      errors.slug = `Slug kan ikke være mer enn ${VALIDATION_RULES.slug.maxLength} tegn`;
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
    } else if (!VALIDATION_RULES.category.options.includes(state.courseFields.category)) {
      errors.category = 'Velg en gyldig kategori';
    }
  }

  // Validate lesson fields
  if (state.currentStep === 1) {
    if (state.lessons.length === 0) {
      errors.lessons = 'Minst én leksjon er påkrevd';
    } else {
      const currentLesson = state.lessons[state.currentLesson];
      const lessonRules = VALIDATION_RULES.lesson;

      if (!currentLesson.title) {
        errors.title = 'Leksjonstittel er påkrevd';
      } else if (currentLesson.title.length < lessonRules.title.minLength) {
        errors.title = `Leksjonstittel må være minst ${lessonRules.title.minLength} tegn`;
      } else if (currentLesson.title.length > lessonRules.title.maxLength) {
        errors.title = `Leksjonstittel kan ikke være mer enn ${lessonRules.title.maxLength} tegn`;
      }

      if (!currentLesson.slug) {
        errors.slug = 'Leksjon-slug er påkrevd';
      } else if (!VALIDATION_RULES.slug.pattern.test(currentLesson.slug)) {
        errors.slug = 'Leksjon-slug kan kun inneholde små bokstaver, tall og bindestrek';
      } else if (currentLesson.slug.length > lessonRules.slug.maxLength) {
        errors.slug = `Leksjon-slug kan ikke være mer enn ${lessonRules.slug.maxLength} tegn`;
      }

      if (!currentLesson.preAmble) {
        errors.preAmble = 'Ingress er påkrevd';
      } else if (currentLesson.preAmble.length < lessonRules.preAmble.minLength) {
        errors.preAmble = `Ingress må være minst ${lessonRules.preAmble.minLength} tegn`;
      } else if (currentLesson.preAmble.length > lessonRules.preAmble.maxLength) {
        errors.preAmble = `Ingress kan ikke være mer enn ${lessonRules.preAmble.maxLength} tegn`;
      }

      if (!currentLesson.text[0]?.text) {
        errors.text = 'Innhold er påkrevd';
      } else if (currentLesson.text[0].text.length < lessonRules.text.minLength) {
        errors.text = `Innhold må være minst ${lessonRules.text.minLength} tegn`;
      }

      // Check for duplicate slugs in lessons
      const slugCount = state.lessons.filter(l => l.slug === currentLesson.slug).length;
      if (slugCount > 1) {
        errors.slug = 'Denne leksjon-slugen er allerede i bruk';
      }
    }
  }

  // Log validation errors for debugging
  console.log("Validation errors:", errors);

  return errors;
}
