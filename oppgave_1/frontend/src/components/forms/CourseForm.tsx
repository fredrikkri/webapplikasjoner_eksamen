import { useState, useEffect, useRef } from 'react';
import { type CourseFields } from '../../types/types';
import { useCategories } from '../../hooks/useCategories';

interface CourseFormProps {
  courseFields: CourseFields;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: { [key: string]: string | undefined };
  disabled?: boolean;
}

export function CourseForm({ 
  courseFields, 
  onChange, 
  errors, 
  disabled = false 
}: CourseFormProps) {
  const { categories = [], loading: categoriesLoading, error: categoriesError } = useCategories();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const categorySelectRef = useRef<HTMLSelectElement>(null);

  // Track initial load state
  useEffect(() => {
    if (categories.length > 0) {
      setIsInitialLoad(false);
    }
  }, [categories]);

  // Determine if form fields should be disabled
  const isCategorySelectDisabled = disabled || categoriesLoading || isInitialLoad;
  const isFieldDisabled = disabled;

  // Ensure category select is disabled during loading
  useEffect(() => {
    if (categorySelectRef.current) {
      categorySelectRef.current.disabled = isCategorySelectDisabled;
    }
  }, [isCategorySelectDisabled]);

  // Force update disabled state after categories load
  useEffect(() => {
    if (!categoriesLoading && categorySelectRef.current) {
      categorySelectRef.current.disabled = isCategorySelectDisabled;
    }
  }, [categoriesLoading, isCategorySelectDisabled]);

  return (
    <div data-testid="course_step" className="max-w-2xl">
      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="title">
          Tittel<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${
            errors.title ? 'border-red-500' : 'border-slate-200'
          } px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
            isFieldDisabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
          data-testid="form_title"
          type="text"
          name="title"
          id="title"
          placeholder="F.eks. Introduksjon til React"
          value={courseFields.title}
          onChange={onChange}
          disabled={isFieldDisabled}
          aria-invalid={errors.title ? 'true' : 'false'}
          aria-describedby={errors.title ? 'title-error' : undefined}
        />
        {errors.title && (
          <p id="title-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.title}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="description">
          Beskrivelse<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${
            errors.description ? 'border-red-500' : 'border-slate-200'
          } px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
            isFieldDisabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
          data-testid="form_description"
          type="text"
          name="description"
          id="description"
          placeholder="Kort beskrivelse av kurset"
          value={courseFields.description}
          onChange={onChange}
          disabled={isFieldDisabled}
          aria-invalid={errors.description ? 'true' : 'false'}
          aria-describedby={errors.description ? 'description-error' : undefined}
        />
        {errors.description && (
          <p id="description-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.description}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="category">
          Kategori<span className="text-emerald-600">*</span>
        </label>
        <div className="relative">
          <select
            ref={categorySelectRef}
            className={`w-full appearance-none rounded-lg border ${
              errors.category ? 'border-red-500' : 'border-slate-200'
            } bg-white px-4 py-2.5 pr-10 transition-colors focus:border-emerald-600 focus:outline-none ${
              isCategorySelectDisabled ? 'cursor-not-allowed bg-slate-50' : ''
            }`}
            data-testid="form_category"
            name="category"
            id="category"
            value={courseFields.category}
            onChange={onChange}
            disabled={isCategorySelectDisabled}
            aria-invalid={errors.category ? 'true' : 'false'}
            aria-describedby={errors.category ? 'category-error' : undefined}
            aria-busy={categoriesLoading}
          >
            <option value="">Velg kategori</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {errors.category && (
          <p id="category-error" className="mt-1 text-sm text-red-500" role="alert">
            {errors.category}
          </p>
        )}
        {categoriesError && (
          <p className="mt-1 text-sm text-red-500" role="alert">
            Kunne ikke laste kategorier: {categoriesError.message}
          </p>
        )}
        {(categoriesLoading || isInitialLoad) && (
          <p className="mt-1 text-sm text-slate-500" role="alert">
            Laster kategorier...
          </p>
        )}
      </div>
    </div>
  );
}
