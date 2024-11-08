import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LessonForm } from './LessonForm';
import { getLesson, updateLesson } from '../../lib/services/lessons';
import type { LessonFields } from '../../types/types';
import type { EditorConfig } from '../editors';

interface EditLessonFormProps {
  courseSlug: string;
  lessonSlug: string;
}

const editorConfig: EditorConfig = {
  type: 'tiptap',
  options: {
    placeholder: 'Skriv leksjonsinnholdet her...',
    initialContent: ''
  }
};

export function EditLessonForm({ courseSlug, lessonSlug }: EditLessonFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lessonFields, setLessonFields] = useState<LessonFields>({
    id: '',
    title: '',
    slug: '',
    preAmble: '',
    text: [{ id: '1', text: '' }],
    order: '1',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const lesson = await getLesson(courseSlug, lessonSlug);
        if (lesson) {
          setLessonFields({
            id: lesson.id,
            title: lesson.title,
            slug: lesson.slug,
            preAmble: lesson.preAmble,
            text: lesson.text,
            order: lesson.order || '1',
          });
          editorConfig.options = {
            ...editorConfig.options,
            initialContent: lesson.text[0]?.text || ''
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
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleTextChange = (value: string) => {
    setLessonFields(prev => ({
      ...prev,
      text: [{ id: prev.text[0]?.id || '1', text: value }],
    }));
    if (errors.text) {
      setErrors(prev => ({
        ...prev,
        text: '',
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!lessonFields.title) newErrors.title = 'Tittel er påkrevd';
    if (!lessonFields.slug) newErrors.slug = 'Slug er påkrevd';
    if (!lessonFields.preAmble) newErrors.preAmble = 'Ingress er påkrevd';
    if (!lessonFields.text[0]?.text) newErrors.text = 'Innhold er påkrevd';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await updateLesson(courseSlug, lessonSlug, lessonFields);
      router.push(`/kurs/${courseSlug}/${lessonFields.slug}`);
    } catch (error) {
      setError('Kunne ikke oppdatere leksjonen');
      console.error('Error updating lesson:', error);
    }
  };

  if (loading) {
    return <div>Laster...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <LessonForm
        lesson={lessonFields}
        onChange={handleChange}
        onTextChange={handleTextChange}
        errors={errors}
        editorConfig={editorConfig}
      />
      <div className="mt-6">
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-6 py-2 font-medium text-white hover:bg-emerald-700"
        >
          Oppdater leksjon
        </button>
      </div>
    </form>
  );
}
