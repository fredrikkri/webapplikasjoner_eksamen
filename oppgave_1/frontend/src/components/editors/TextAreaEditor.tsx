import { Editor } from './types';

export function TextAreaEditor({ 
  value = '', 
  onChange, 
  placeholder, 
  disabled = false,
  'aria-invalid': ariaInvalid,
  'aria-describedby': ariaDescribedby,
  className
}: Editor) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Only trigger onChange if content actually changed
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  return (
    <div 
      className={`relative ${className || ''}`}
      data-testid="textarea-editor"
    >
      <textarea
        className={`w-full rounded-lg border px-4 py-2.5 transition-colors focus:outline-none ${
          ariaInvalid === true || ariaInvalid === 'true'
            ? 'border-red-500' 
            : 'border-slate-200 focus:border-emerald-600'
        } ${
          disabled 
            ? 'cursor-not-allowed bg-slate-50 opacity-50' 
            : ''
        }`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder || 'Skriv innhold her...'}
        rows={4}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        aria-describedby={ariaDescribedby}
        aria-multiline="true"
        data-testid="textarea-content"
      />
    </div>
  );
}
