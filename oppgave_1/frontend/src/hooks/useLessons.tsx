import { useState, useEffect } from "react";
import { getLesson } from "../lib/services";

interface LessonText {
  id: string;
  text: string;
}

export interface Lesson {
  id: string;
  title: string;
  slug: string;
  preAmble: string;
  text: LessonText[];
  order?: string; // Made optional since it's not always present
}

export const useLesson = (courseSlug: string, lessonSlug: string) => {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const data = await getLesson(courseSlug, lessonSlug);
        setLesson(data as Lesson);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug && lessonSlug) {
      fetchLesson();
    }
  }, [courseSlug, lessonSlug]);

  return { lesson, loading, error };
};
