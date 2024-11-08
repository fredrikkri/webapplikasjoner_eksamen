import { createId } from "@/util/utils";
import type { Course} from "../../types/course";
import type { Lesson} from "../../types/lesson";


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

export const createLessonResponse = (lesson: Lesson): Lesson => {
  const { 
    title, 
    slug, 
    preAmble, 
    text,
} = lesson;

  return {
    ...lesson,
    title, 
    slug, 
    preAmble, 
    text,
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

export const fromDbLession = (lesson: Lesson): Lesson => {
  return {
      id: lesson.id.toString() ?? createId(),
      title: lesson.title ?? "",
      slug: lesson.slug ?? "",
      preAmble: lesson.preAmble ?? "",
      text: lesson.text ?? [],
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