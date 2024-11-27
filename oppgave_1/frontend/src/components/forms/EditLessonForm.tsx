import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LessonForm } from './LessonForm';
import { getLesson, updateLesson } from '../../lib/services/lessons';
import type { LessonFields } from '../../types/types';
import type { EditorConfig } from '../editors';
import { validateForm } from '../../reducers/formReducer';
import Link from 'next/link';

interface EditLessonFormProps {
  courseSlug: string;
  lessonSlug: string;
}

const editorConfig: EditorConfig = {
  type: 'tiptap',
  options: {
    placeholder: 'Skriv leksjonsinnholdet her...'
  }
};

export function EditLessonForm({ courseSlug, lessonSlug }: EditLessonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonFields, setLessonFields] = useState<LessonFields>({
    id: '',
    title: '',
    preAmble: '',
    text: [{ id: '1', text: '' }],
    order: '1',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lesson = await getLesson(courseSlug, lessonSlug);
        if (lesson) {
          setLessonFields({
            id: lesson.id,
            title: lesson.title,
            preAmble: lesson.preAmble,
            text: lesson.text && lesson.text.length > 0 ? lesson.text : [{ id: '1', text: '' }],
            order: lesson.order || '1',
          });
          editorConfig.options = {
            ...editorConfig.options
          };
        }
      } catch (error) {
        setError('Kunne ikke hente leksjonsinformasjon');
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [courseSlug, lessonSlug]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLessonFields(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the changed field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTextChange = (value: string) => {
    setLessonFields(prev => ({
      ...prev,
      text: [{ id: prev.text[0]?.id || '1', text: value }],
    }));
    // Clear error for text field
    if (errors.text) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.text;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    // Use the same validation as LessonForm by creating a form state
    const validationErrors = validateForm({
      courseFields: {
        id: '',
        title: '',
        description: '',
        category: '',
      },
      lessons: [lessonFields],
      currentStep: 1,
      currentLesson: 0,
      errors: {},
      status: 'idle',
      message: '',
    });

    // Extract only the lesson-related errors
    const lessonErrors: Record<string, string> = {};
    Object.entries(validationErrors).forEach(([key, value]) => {
      if (key.startsWith('lesson_0_')) {
        lessonErrors[key.replace('lesson_0_', '')] = value;
      }
    });

    if (Object.keys(lessonErrors).length > 0) {
      setErrors(lessonErrors);
      setIsSaving(false);
      return;
    }

    try {
      const formattedData = {
        ...lessonFields,
        text: lessonFields.text.map(t => ({
          id: t.id || '1',
          text: t.text
        }))
      };

      const updatedLesson = await updateLesson(courseSlug, lessonSlug, formattedData);
      router.push(`/kurs/${courseSlug}/${updatedLesson.slug}`);
    } catch (error) {
      setError('Kunne ikke oppdatere leksjonen');
      console.error('Error updating lesson:', error);
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
        <LessonForm
          lesson={lessonFields}
          onChange={handleChange}
          onTextChange={handleTextChange}
          errors={errors}
          editorConfig={editorConfig}
        />
        <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-8">
          <Link
            href={`/kurs/${courseSlug}/${lessonSlug}`}
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
