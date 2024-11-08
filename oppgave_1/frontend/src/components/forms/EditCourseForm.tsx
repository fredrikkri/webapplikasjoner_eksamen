import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CourseForm } from './CourseForm';
import { getCourse, updateCourse } from '../../lib/services/courses';
import type { CourseFields } from '../../types/types';
import Link from 'next/link';

interface EditCourseFormProps {
  slug: string;
}

export function EditCourseForm({ slug }: EditCourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseFields, setCourseFields] = useState<CourseFields>({
    id: '',
    title: '',
    slug: '',
    description: '',
    category: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course = await getCourse(slug);
        setCourseFields({
          id: course.id,
          title: course.title,
          slug: course.slug,
          description: course.description,
          category: course.category,
        });
      } catch (error) {
        setError('Kunne ikke hente kursinformasjon');
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setCourseFields(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!courseFields.title) newErrors.title = 'Tittel er påkrevd';
    if (!courseFields.slug) newErrors.slug = 'Slug er påkrevd';
    if (!courseFields.description) newErrors.description = 'Beskrivelse er påkrevd';
    if (!courseFields.category) newErrors.category = 'Kategori er påkrevd';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSaving(false);
      return;
    }

    try {
      await updateCourse(slug, courseFields);
      router.push(`/kurs/${courseFields.slug}`);
    } catch (error) {
      setError('Kunne ikke oppdatere kurset');
      console.error('Error updating course:', error);
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-lg font-medium text-slate-600">Laster innhold...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-red-100 bg-red-50 p-6">
        <div className="flex items-center gap-3">
          <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-medium text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <form onSubmit={handleSubmit}>
        <CourseForm
          courseFields={courseFields}
          onChange={handleChange}
          errors={errors}
        />
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-8">
          <Link
            href={`/kurs/${slug}`}
            className="flex items-center gap-2 rounded-lg bg-slate-100 px-6 py-2 font-medium text-slate-700 transition-all hover:bg-slate-200"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Avbryt
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="group flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white transition-all hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Lagrer...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Lagre endringer
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
