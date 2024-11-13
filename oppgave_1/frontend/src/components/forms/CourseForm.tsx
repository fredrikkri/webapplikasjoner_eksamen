import { useState, useEffect } from 'react';
import { type CourseFields } from '../../types/types';
import { getCategories } from '../../lib/services/courses';

interface CourseFormProps {
  courseFields: CourseFields;
  onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: { [key: string]: string | undefined };
  disabled?: boolean;
}

export function CourseForm({ courseFields, onChange, errors, disabled = false }: CourseFormProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div data-testid="course_step" className="max-w-2xl">
      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="title">
          Tittel<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${errors.title ? 'border-red-500' : 'border-slate-200'} px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
            disabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
          data-testid="form_title"
          type="text"
          name="title"
          id="title"
          placeholder="F.eks. Introduksjon til React"
          value={courseFields.title}
          onChange={onChange}
          disabled={disabled}
        />
        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="slug">
          Slug<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${errors.slug ? 'border-red-500' : 'border-slate-200'} px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
            disabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
          data-testid="form_slug"
          type="text"
          name="slug"
          id="slug"
          placeholder="F.eks. intro-til-react"
          value={courseFields.slug}
          onChange={onChange}
          disabled={disabled}
        />
        {errors.slug && <p className="mt-1 text-sm text-red-500">{errors.slug}</p>}
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="description">
          Beskrivelse<span className="text-emerald-600">*</span>
        </label>
        <input
          className={`w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-slate-200'} px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
            disabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
          data-testid="form_description"
          type="text"
          name="description"
          id="description"
          placeholder="Kort beskrivelse av kurset"
          value={courseFields.description}
          onChange={onChange}
          disabled={disabled}
        />
        {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
      </div>

      <div className="mb-6">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="category">
          Kategori<span className="text-emerald-600">*</span>
        </label>
        <select
          className={`w-full rounded-lg border ${errors.category ? 'border-red-500' : 'border-slate-200'} px-4 py-2.5 transition-colors focus:border-emerald-600 focus:outline-none ${
            disabled ? 'cursor-not-allowed bg-slate-50' : ''
          }`}
          data-testid="form_category"
          name="category"
          id="category"
          value={courseFields.category}
          onChange={onChange}
          disabled={disabled || loading}
        >
          <option value="">Velg kategori</option>
          {categories.map((category) => (
            <option key={category} value={category.toLowerCase()}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
      </div>
    </div>
  );
}
