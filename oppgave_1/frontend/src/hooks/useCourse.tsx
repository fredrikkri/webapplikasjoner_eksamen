import { useState, useEffect } from "react";
import { getCourse, createCourse, getAllCourses } from "../lib/services/courses";
import { Course, CreateCourseData } from "../types/types";

export const useAllCourses = () => {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('Starting courses fetch for page:', currentPage);
        setLoading(true);
        setError(null);
        const data = await getAllCourses(currentPage);
        console.log('Courses fetch result:', data);
        setCourses(data.courses);
        setTotalPages(data.totalPages);
        setHasNextPage(data.hasNextPage);
        setHasPreviousPage(data.hasPreviousPage);
        console.log('Courses state updated:', {
          coursesCount: data.courses.length,
          totalPages: data.totalPages,
          hasNextPage: data.hasNextPage,
          hasPreviousPage: data.hasPreviousPage
        });
      } catch (err) {
        console.error('Error in courses fetch:', err);
        setError(err instanceof Error ? err : new Error('An error occurred while fetching all courses'));
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [currentPage]);

  const nextPage = () => {
    if (hasNextPage) {
      console.log('Moving to next page:', currentPage + 1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (hasPreviousPage) {
      console.log('Moving to previous page:', currentPage - 1);
      setCurrentPage(prev => prev - 1);
    }
  };

  return { 
    courses, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    hasNextPage, 
    hasPreviousPage, 
    nextPage, 
    previousPage 
  };
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
  const [success, setSuccess] = useState<boolean>(false);

  const addCourse = async (data: CreateCourseData): Promise<Course> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const createdCourse = await createCourse(data);
      setSuccess(true);
      return createdCourse;
    } catch (err) {
      let errorMessage = 'Failed to create course';
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        errorMessage = String(err.message);
      }

      const error = new Error(errorMessage);
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { 
    addCourse, 
    loading, 
    error,
    success,
    isReady: true
  };
};
