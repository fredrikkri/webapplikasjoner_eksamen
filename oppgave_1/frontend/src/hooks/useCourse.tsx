import { useState, useEffect } from "react";
import { getCourse, createCourse, getAllCourses } from "../lib/services";
import { Course, ApiResponse } from "../types/types";

export const useAllCourses = () => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllCourses();
        setCourses(data);
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
        setError(null);
        const data = await getCourse(courseSlug);
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch course'));
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
  const { courses, loading: coursesLoading } = useAllCourses();

  const addCourse = async (courseData: Course): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      if (courses) {
        const updatedCourses = [...courses, courseData];
      }

      await createCourse(courseData);
    } catch (err) {
      if (courses) {
        const originalCourses = courses.filter(course => course.id !== courseData.id);
      }

      let errorMessage = 'Failed to create course';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String(err.message);
      }

      setError(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { 
    addCourse, 
    loading, 
    error,
    isReady: !coursesLoading
  };
};
