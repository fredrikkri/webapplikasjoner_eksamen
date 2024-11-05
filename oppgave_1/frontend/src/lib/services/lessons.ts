import { courses } from "../../data/data";

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
  order?: string;
}

// Henter en spesifikk leksjon basert på courseSlug og lessonSlug
export const getLesson = async (courseSlug: string, lessonSlug: string): Promise<Lesson | undefined> => {
  const course = courses.find(course => course.slug === courseSlug);
  if (!course) return undefined;
  
  const lesson = course.lessons.find(lesson => lesson.slug === lessonSlug);
  return lesson;
};
