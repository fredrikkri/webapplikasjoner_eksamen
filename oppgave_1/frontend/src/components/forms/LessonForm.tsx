import { type LessonFields } from '../../types/types';
import { EditorWrapper, type EditorConfig } from '../editors';

interface LessonFormProps {
  lesson: LessonFields;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (value: string) => void;
  errors: Record<string, string>;
  editorConfig: EditorConfig;
}

export function LessonForm({ lesson, onChange, onTextChange, errors, editorConfig }: LessonFormProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="lessonTitle">
          Leksjonstittel<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${errors.title ? 'border-red-500' : 'border-slate-200'} px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none`}
          data-testid="form_lesson_title"
          type="text"
          name="title"
          id="lessonTitle"
          placeholder="F.eks. Introduksjon til komponenter"
          value={lesson.title}
          onChange={onChange}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="lessonSlug">
          Slug<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${errors.slug ? 'border-red-500' : 'border-slate-200'} px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none`}
          data-testid="form_lesson_slug"
          type="text"
          name="slug"
          id="lessonSlug"
          placeholder="F.eks. intro-til-komponenter"
          value={lesson.slug}
          onChange={onChange}
        />
        {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="lessonPreAmble">
          Ingress<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${errors.preAmble ? 'border-red-500' : 'border-slate-200'} px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none`}
          data-testid="form_lesson_preAmble"
          type="text"
          name="preAmble"
          id="lessonPreAmble"
          placeholder="Kort beskrivelse av leksjonen"
          value={lesson.preAmble}
          onChange={onChange}
        />
        {errors.preAmble && <p className="mt-1 text-sm text-red-500">{errors.preAmble}</p>}
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="lessonText">
          Innhold<span className="text-emerald-600">*</span>
        </label>
        <EditorWrapper
          value={lesson.text[0]?.text || ""}
          onChange={onTextChange}
          placeholder="Skriv leksjonsinnholdet her..."
          config={editorConfig}
        />
        {errors.text && <p className="mt-1 text-sm text-red-500">{errors.text}</p>}
      </div>
    </div>
  );
}
