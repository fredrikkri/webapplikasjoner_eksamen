import { Editor } from './types';

/**
 * Basic textarea implementation of the Editor interface
 * This maintains the original functionality while conforming to our new editor system
 */
export function TextAreaEditor({ value, onChange, placeholder }: Editor) {
  return (
    <textarea
      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
    />
  );
}
