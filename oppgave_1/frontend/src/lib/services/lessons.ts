import { ENDPOINTS } from "@/config/config";
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
  // const course = courses.find(course => course.slug === courseSlug);
  // if (!course) return undefined;
  const response = await fetch(ENDPOINTS.courses+`/${courseSlug}`+`/${lessonSlug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }
  const course = await response.json();
  if (!course.success) {
    throw new Error(course.error.message || "Failed to fetch course");
  }

  return course.data as Lesson;
  
  // const lesson = course.lessons.find(lesson => lesson.slug === lessonSlug);
  // return lesson;
};
