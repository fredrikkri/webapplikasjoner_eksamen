import { courses } from "../../data/data";

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
  order?: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  lessons: Lesson[];
}

// Henter et kurs basert på slug
export const getCourse = async (slug: string): Promise<Course | undefined> => {
  const course = courses.find((course) => course.slug === slug);
  return course;
};

// Oppretter et nytt kurs og legger det til kurslisten
export const createCourse = async (data: Course): Promise<void> => {
  courses.push(data);
};
