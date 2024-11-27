import { type LessonFields } from '../../types/types';
import { type EditorConfig } from '../editors';
import { EditorWrapper } from '../editors/EditorWrapper';
import { useEffect, useRef } from 'react';

interface LessonFormProps {
  lesson: LessonFields;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onTextChange: (value: string) => void;
  errors: { [key: string]: string | undefined };
  editorConfig: EditorConfig;
  disabled?: boolean;
}

export function LessonForm({ 
  lesson, 
  onChange, 
  onTextChange, 
  errors, 
  editorConfig, 
  disabled = false 
}: LessonFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Force update disabled state on first render and when disabled changes
  useEffect(() => {
    if (formRef.current) {
      const inputs = formRef.current.querySelectorAll('input, textarea, [contenteditable="true"]');
      inputs.forEach(input => {
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
          input.disabled = disabled;
        }
        if (input.hasAttribute('contenteditable')) {
          input.setAttribute('contenteditable', (!disabled).toString());
        }
      });
    }
  }, [disabled]);

  // Handle initial render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (formRef.current && disabled) {
        const inputs = formRef.current.querySelectorAll('input, textarea, [contenteditable="true"]');
        inputs.forEach(input => {
          if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
            input.disabled = true;
          }
          if (input.hasAttribute('contenteditable')) {
            input.setAttribute('contenteditable', 'false');
          }
        });
      }
    }
  }, [disabled]);

  const handleEditorChange = (value: string) => {
    // Preserve editor content when switching types
    const preservedContent = value;
    onTextChange(preservedContent);
  };

  const currentText = lesson.text?.[0]?.text || '';

  return (
    <div 
      ref={formRef}
      className="space-y-6" 
      data-testid="lesson_form"
      aria-disabled={disabled}
    >
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
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.title}
          </p>
        )}
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
          aria-invalid={errors.preAmble ? 'true' : 'false'}
          aria-describedby={errors.preAmble ? 'preamble-error' : undefined}
        />
        {errors.preAmble && (
          <p id="preamble-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.preAmble}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700" htmlFor="lesson-content">
          Innhold<span className="text-emerald-600">*</span>
        </label>
        <div 
          className={`rounded-lg border ${
            errors.text ? 'border-red-500' : 'border-slate-200'
          } transition-colors focus-within:border-emerald-600 ${
            disabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
        >
          <EditorWrapper
            config={editorConfig}
            value={currentText}
            onChange={handleEditorChange}
            disabled={disabled}
            aria-invalid={errors.text ? 'true' : 'false'}
            aria-describedby={errors.text ? 'text-error' : undefined}
            placeholder="Skriv leksjonens innhold her..."
            data-testid="lesson-content-editor"
          />
        </div>
        {errors.text && (
          <p id="text-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.text}
          </p>
        )}
      </div>
    </div>
  );
}
