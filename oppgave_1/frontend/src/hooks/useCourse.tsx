import { useState, useEffect } from "react";
import { getCourse, createCourse, getAllCourses } from "../lib/services";

interface LessonText {
  id: string;
  text: string;
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  preAmble: string;
  text: LessonText[];
  order?: string; // Made optional since it's not always present
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  lessons: Lesson[];
}

export interface CourseData {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  lessons: Lesson[];
}

export const useAllCourses = () => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await getAllCourses();
        setCourses(data as Course[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred while fetching all courses'));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};

export const useCourse = (courseSlug: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await getCourse(courseSlug);
        setCourse(data as Course);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    if (courseSlug) {
      fetchCourse();
    }
  }, [courseSlug]);

  return { course, loading, error };
};

export const useCreateCourse = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const addCourse = async (courseData: CourseData) => {
    try {
      setLoading(true);
      await createCourse(courseData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return { addCourse, useAllCourses, loading, error };
};
