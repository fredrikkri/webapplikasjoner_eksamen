import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCourse } from "../hooks/useCourse";
import { defaultEditorConfig, tiptapEditorConfig, type EditorConfig } from "./editors";
import { CourseForm } from "./forms/CourseForm";
import { LessonForm } from "./forms/LessonForm";
import { LessonList } from "./forms/LessonList";
import { formReducer, initialState, validateForm } from "../reducers/formReducer";
import type { FormErrors } from "../types/types";

const steps = [
  { id: 0, name: "Kursdetaljer" },
  { id: 1, name: "Leksjoner" },
];

function Create() {
  const router = useRouter();
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(tiptapEditorConfig);
  const { addCourse, loading } = useCreateCourse();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({ type: 'CLEAR_ERRORS' });

    const validationErrors = validateForm(state);
    console.log("Form validation errors:", validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        if (message) {
          dispatch({ type: 'SET_ERROR', field, message });
        }
      });
      return;
    }

    try {
      console.log("Submitting course data:", {
        ...state.courseFields,
        lessons: state.lessons,
      });

      dispatch({ type: 'SET_STATUS', status: 'loading' });

      await addCourse({
        ...state.courseFields,
        lessons: state.lessons,
      });

      dispatch({
        type: 'SET_STATUS',
        status: 'success',
        message: 'Kurset er opprettet!',
      });

      setTimeout(() => {
        router.push('/kurs');
      }, 1500);
    } catch (error) {
      console.error("Error creating course:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'En feil oppstod under oppretting av kurset';

      dispatch({
        type: 'SET_STATUS',
        status: 'error',
        message: errorMessage,
      });
    }
  };

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="mb-12 text-center">
        <h2 className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-3xl font-bold text-transparent" data-testid="title">
          Lag nytt kurs
        </h2>
        <p className="mt-2 text-slate-600">
          Fyll ut informasjonen under for å opprette et nytt kurs
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="relative">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-slate-200"></div>
          <div
            className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-emerald-600 transition-all duration-500"
            style={{ width: `${(state.currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => index <= state.currentStep && dispatch({ type: 'SET_CURRENT_STEP', step: index })}
                disabled={index > state.currentStep || loading}
                className={`group flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  index <= state.currentStep
                    ? "border-emerald-600 bg-emerald-600 text-white hover:shadow-lg"
                    : "border-slate-300 bg-white text-slate-500"
                } ${
                  index <= state.currentStep && !loading ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                <span className="transition-transform duration-200 group-hover:scale-110">
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`text-sm font-medium transition-colors duration-200 ${
                index <= state.currentStep ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {step.name}
            </span>
          ))}
        </div>
      </div>

      <form className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md" data-testid="form" onSubmit={handleSubmit} noValidate>
        {state.currentStep === 0 ? (
          <CourseForm
            courseFields={state.courseFields}
            onChange={(e) => dispatch({
               type: 'SET_COURSE_FIELD', 
               field: e.target.name as keyof typeof state.courseFields,
               value: e.target.value })}
            errors={state.errors}
            disabled={loading}
          />
        ) : null}

        {state.currentStep === 1 ? (
          <>
            <div className="mb-4 flex justify-end">
              <select
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm transition-all duration-200 hover:border-emerald-600 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-100 disabled:opacity-50"
                value={editorConfig.type}
                onChange={(e) => setEditorConfig(e.target.value === 'textarea' ? defaultEditorConfig : tiptapEditorConfig)}
                disabled={loading}
              >
                <option value="textarea">Simple Editor</option>
                <option value="tiptap">Rich Text Editor</option>
              </select>
            </div>
            <div data-testid="lesson_step" className="grid w-full grid-cols-[300px_minmax(50%,_1fr)] gap-8">
              <LessonList
                lessons={state.lessons}
                currentLesson={state.currentLesson}
                onSelectLesson={(index) => dispatch({ type: 'SET_CURRENT_LESSON', lesson: index })}
                onAddLesson={() => dispatch({ type: 'ADD_LESSON' })}
                disabled={loading}
              />

              {state.lessons.length > 0 ? (
                <LessonForm
                  lesson={state.lessons[state.currentLesson]}
                  onChange={(e) => dispatch({ 
                    type: 'SET_LESSON_FIELD', 
                    index: state.currentLesson, 
                    field: e.target.name as keyof typeof state.lessons[0],
                    value: e.target.value })}
                  onTextChange={(value) => dispatch({ type: 'SET_LESSON_TEXT', index: state.currentLesson, value })}
                  errors={state.errors}
                  editorConfig={editorConfig}
                  disabled={loading}
                />
              ) : (
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-8 transition-all duration-300 hover:border-emerald-600 hover:bg-emerald-50">
                  <div className="text-center">
                    <p className="mb-2 text-lg font-medium text-slate-700">
                      Ingen leksjoner lagt til
                    </p>
                    <p className="text-slate-600">
                      Klikk på "Legg til leksjon" for å komme i gang
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}

        {state.status === 'error' && state.message && (
          <div className="mb-6 mt-6 animate-fade-in rounded-lg bg-red-50 p-4 text-center">
            <p className="font-medium text-red-800">{state.message}</p>
          </div>
        )}

        {state.status === 'success' && state.message && (
          <div className="mb-6 mt-6 animate-fade-in rounded-lg bg-emerald-50 p-4 text-center">
            <p className="font-medium text-emerald-800">{state.message}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            className={`group inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-all duration-200 ${
              state.currentStep === 1
                ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-600 focus:ring-offset-2"
                : "bg-slate-800 text-white hover:bg-slate-900 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-800 focus:ring-offset-2"
            } ${loading ? "cursor-not-allowed opacity-50" : ""}`}
            type={state.currentStep === 1 ? "submit" : "button"}
            onClick={() => state.currentStep === 0 && dispatch({ type: 'SET_CURRENT_STEP', step: 1 })}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Lagrer...</span>
              </>
            ) : (
              <>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  {state.currentStep === 1 ? "Publiser kurs" : "Neste steg"}
                </span>
                <svg 
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Create;
