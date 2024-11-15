import { Editor } from './types';

export function TextAreaEditor({ value, onChange, placeholder, disabled = false }: Editor) {
  return (
    <textarea
      className={`w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
        disabled ? 'cursor-not-allowed bg-slate-50' : ''
      }`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      disabled={disabled}
    />
  );
}
