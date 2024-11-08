import { useReducer, useState } from "react";
import { useCreateCourse } from "../hooks/useCourse";
import { defaultEditorConfig, tiptapEditorConfig, type EditorConfig } from "./editors";
import { CourseForm } from "./forms/CourseForm";
import { LessonForm } from "./forms/LessonForm";
import { LessonList } from "./forms/LessonList";
import { formReducer, initialState, validateForm } from "../reducers/formReducer";

const steps = [
  { id: 0, name: "Kursdetaljer" },
  { id: 1, name: "Leksjoner" },
];

function Create() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [editorConfig, setEditorConfig] = useState<EditorConfig>(tiptapEditorConfig);
  const { addCourse } = useCreateCourse();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    dispatch({ type: 'CLEAR_ERRORS' });

    const errors = validateForm(state);
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([field, message]) => {
        dispatch({ type: 'SET_ERROR', field, message });
      });
      return;
    }

    try {
      dispatch({ type: 'SET_STATUS', status: 'loading' });
      
      // Optimistic update
      dispatch({ type: 'SET_STATUS', status: 'success', message: 'Kurset er opprettet!' });
      
      await addCourse({
        ...state.courseFields,
        lessons: state.lessons,
      });
    } catch (error) {
      dispatch({ 
        type: 'SET_STATUS', 
        status: 'error',
        message: error instanceof Error ? error.message : 'En feil oppstod under oppretting av kurset'
      });
    }
  };

  const handleCourseFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    dispatch({ 
      type: 'SET_COURSE_FIELD', 
      field: name as keyof typeof state.courseFields, 
      value 
    });
  };

  const handleLessonFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    dispatch({ 
      type: 'SET_LESSON_FIELD',
      index: state.currentLesson,
      field: name as keyof typeof state.lessons[0],
      value
    });
  };

  const handleLessonTextChange = (value: string) => {
    dispatch({
      type: 'SET_LESSON_TEXT',
      index: state.currentLesson,
      value
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-slate-800" data-testid="title">
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
                disabled={index > state.currentStep}
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  index <= state.currentStep
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-300 bg-white text-slate-500"
                } transition-all duration-200 ${
                  index <= state.currentStep ? "cursor-pointer hover:shadow-lg" : "cursor-not-allowed"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`text-sm font-medium ${
                index <= state.currentStep ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {step.name}
            </span>
          ))}
        </div>
      </div>

      <form className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm" data-testid="form" onSubmit={handleSubmit} noValidate>
        {state.currentStep === 0 ? (
          <CourseForm
            courseFields={state.courseFields}
            onChange={handleCourseFieldChange}
            errors={state.errors}
          />
        ) : null}

        {state.currentStep === 1 ? (
          <>
            <div className="mb-4 flex justify-end">
              <select
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                value={editorConfig.type}
                onChange={(e) => setEditorConfig(e.target.value === 'textarea' ? defaultEditorConfig : tiptapEditorConfig)}
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
              />

              {state.lessons.length > 0 ? (
                <LessonForm
                  lesson={state.lessons[state.currentLesson]}
                  onChange={handleLessonFieldChange}
                  onTextChange={handleLessonTextChange}
                  errors={state.errors}
                  editorConfig={editorConfig}
                />
              ) : (
                <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-8">
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
          <div className="mb-6 mt-6 rounded-lg bg-red-50 p-4 text-center">
            <p className="font-medium text-red-800">{state.message}</p>
          </div>
        )}

        {state.status === 'success' && state.message && (
          <div className="mb-6 mt-6 rounded-lg bg-emerald-50 p-4 text-center">
            <p className="font-medium text-emerald-800">{state.message}</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            className={`inline-flex items-center gap-2 rounded-lg px-6 py-2.5 font-medium transition-all ${
              state.currentStep === 1
                ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg"
                : "bg-slate-800 text-white hover:bg-slate-900 hover:shadow-lg"
            }`}
            type={state.currentStep === 1 ? "submit" : "button"}
            onClick={() => state.currentStep === 0 && dispatch({ type: 'SET_CURRENT_STEP', step: 1 })}
            disabled={state.status === 'loading'}
          >
            {state.status === 'loading' ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Lagrer...</span>
              </>
            ) : state.currentStep === 1 ? (
              "Publiser kurs"
            ) : (
              "Neste steg"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Create;
