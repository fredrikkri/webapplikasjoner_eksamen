import { type LessonFields } from '../../types/types';
import { type EditorConfig } from '../editors';
import { EditorWrapper } from '../editors/EditorWrapper';

interface LessonFormProps {
  lesson: LessonFields;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (value: string) => void;
  errors: { [key: string]: string | undefined };
  editorConfig: EditorConfig;
  disabled?: boolean;
}

export function LessonForm({ lesson, onChange, onTextChange, errors, editorConfig, disabled = false }: LessonFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block font-medium text-slate-700" htmlFor="title">
          Tittel<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${
            errors.title ? 'border-red-500' : 'border-slate-200'
          } px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
            disabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
          data-testid="form_lesson_title"
          type="text"
          name="title"
          id="title"
          placeholder="F.eks. Introduksjon til React"
          value={lesson.title}
          onChange={onChange}
          disabled={disabled}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700" htmlFor="preAmble">
          Ingress<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${
            errors.preAmble ? 'border-red-500' : 'border-slate-200'
          } px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
            disabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
          data-testid="form_lesson_preamble"
          type="text"
          name="preAmble"
          id="preAmble"
          placeholder="Kort beskrivelse av leksjonen"
          value={lesson.preAmble}
          onChange={onChange}
          disabled={disabled}
        />
        {errors.preAmble && <p className="mt-1 text-sm text-red-500">{errors.preAmble}</p>}
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700" htmlFor="text">
          Innhold<span className="text-emerald-600">*</span>
        </label>
        <EditorWrapper
          config={editorConfig}
          value={lesson.text?.[0]?.text ?? ''}
          onChange={onTextChange}
          disabled={disabled}
        />
        {errors.text && <p className="mt-1 text-sm text-red-500">{errors.text}</p>}
      </div>
    </div>
  );
}
