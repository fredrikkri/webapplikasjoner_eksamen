import type { Course } from "../../types/types";

const createId = () => {
  return crypto.randomUUID();
};

export const createCourseResponse = (course: Course): Course => {
  const { id, 
    title, 
    slug, 
    description, 
    category,
} = course;

  return {
    ...course,
    title, 
    slug, 
    description, 
    category,
  };
};

export const fromDb = (course: Course) => {
  return {
    id: course.id ?? createId(),  
    title: course?.title ?? "", 
    slug: course?.slug ?? "", 
    description: course?.description ?? "", 
    category: course?.category ?? "", 
    lessons: course?.lessons ?? []
  };
};

export const createCourse = (course: Partial<Course>): Course => {
  return {
    id: course.id ?? createId(),  
    title: course?.title ?? "", 
    slug: course?.slug ?? "", 
    description: course?.description ?? "", 
    category: course?.category ?? "", 
    lessons: course?.lessons ?? []
  };
};

export const toDb = (data: Partial<Course>) => {
  const course = createCourse(data);

  return {
    id: course.id ?? createId(),  
    title: course?.title ?? "", 
    slug: course?.slug ?? "", 
    description: course?.description ?? "", 
    category: course?.category ?? "", 
    lessons: course?.lessons ?? []
  };
};