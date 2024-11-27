import { type LessonFields } from '../../types/types';

interface LessonListProps {
  lessons: LessonFields[];
  currentLesson: number;
  onSelectLesson: (index: number) => void;
  onAddLesson: () => void;
  onRemoveLesson?: (index: number) => void;
  disabled?: boolean;
  errors?: { [key: string]: string | undefined };
}

export function LessonList({ 
  lessons, 
  currentLesson, 
  onSelectLesson, 
  onAddLesson,
  onRemoveLesson,
  disabled = false,
  errors = {}
}: LessonListProps) {
  // Helper function to check if a lesson has any errors
  const hasErrors = (index: number) => {
    return !!(
      errors[`lesson_${index}_title`] ||
      errors[`lesson_${index}_preAmble`] ||
      errors[`lesson_${index}_text`]
    );
  };

  return (
    <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-4 text-lg font-medium text-slate-800">Leksjoner</h3>
      <div className="mb-4">
        {lessons.length === 0 ? (
          <div data-testid="lessons" className="text-center text-slate-600">
            Ingen leksjoner lagt til
          </div>
        ) : (
          <ul data-testid="lessons" className="space-y-2">
            {lessons.map((lesson, index) => (
              <li
                className={`rounded-lg transition-all ${
                  index === currentLesson
                    ? "bg-emerald-100 shadow-sm"
                    : "hover:bg-white"
                } ${disabled ? "opacity-50" : ""} ${
                  hasErrors(index) ? "border border-red-300" : ""
                }`}
                key={lesson.id}
              >
                <div className="flex items-center justify-between p-3">
                  <button
                    type="button"
                    data-testid="select_lesson_btn"
                    className="flex-1 text-left"
                    onClick={() => onSelectLesson(index)}
                    disabled={disabled}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        hasErrors(index) 
                          ? "bg-red-50 text-red-700" 
                          : "bg-white text-slate-700"
                      } text-sm font-medium`}>
                        {index + 1}
                      </span>
                      <span className={`font-medium ${
                        hasErrors(index) ? "text-red-700" : ""
                      }`}>
                        {lesson.title || `Leksjon ${index + 1}`}
                      </span>
                      {hasErrors(index) && (
                        <svg 
                          className="h-5 w-5 text-red-500" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                  {onRemoveLesson && (
                    <button
                      type="button"
                      onClick={() => onRemoveLesson(index)}
                      disabled={disabled}
                      className="ml-2 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                      title="Fjern leksjon"
                      data-testid="remove_lesson_btn"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {hasErrors(index) && (
                  <div className="px-3 pb-3">
                    <ul className="space-y-1 text-sm text-red-600">
                      {errors[`lesson_${index}_title`] && (
                        <li>{errors[`lesson_${index}_title`]}</li>
                      )}
                      {errors[`lesson_${index}_preAmble`] && (
                        <li>{errors[`lesson_${index}_preAmble`]}</li>
                      )}
                      {errors[`lesson_${index}_text`] && (
                        <li>{errors[`lesson_${index}_text`]}</li>
                      )}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className={`w-full rounded-lg border-2 border-dashed border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-all hover:border-emerald-600 hover:text-emerald-600 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        type="button"
        onClick={onAddLesson}
        data-testid="form_lesson_add"
        disabled={disabled}
      >
        + Legg til leksjon
      </button>
    </aside>
  );
}
