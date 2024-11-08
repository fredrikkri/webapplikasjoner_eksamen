import { type LessonFields } from '../../types/types';

interface LessonListProps {
  lessons: LessonFields[];
  currentLesson: number;
  onSelectLesson: (index: number) => void;
  onAddLesson: () => void;
}

export function LessonList({ lessons, currentLesson, onSelectLesson, onAddLesson }: LessonListProps) {
  return (
    <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <h3 className="mb-4 text-lg font-bold text-slate-800">Leksjoner</h3>
      <ul data-testid="lessons" className="mb-4 space-y-2">
        {lessons.length > 0 &&
          lessons.map((lesson, index) => (
            <li
              className={`rounded-lg transition-all ${
                index === currentLesson
                  ? "bg-emerald-100 shadow-sm"
                  : "hover:bg-white"
              }`}
              key={lesson.id}
            >
              <button
                type="button"
                data-testid="select_lesson_btn"
                className="w-full p-3 text-left"
                onClick={() => onSelectLesson(index)}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="font-medium">
                    {lesson.title || `Leksjon ${index + 1}`}
                  </span>
                </div>
              </button>
            </li>
          ))}
      </ul>
      <button
        className="w-full rounded-lg border-2 border-dashed border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 transition-all hover:border-emerald-600 hover:text-emerald-600"
        type="button"
        onClick={onAddLesson}
        data-testid="form_lesson_add"
      >
        + Legg til leksjon
      </button>
    </aside>
  );
}
