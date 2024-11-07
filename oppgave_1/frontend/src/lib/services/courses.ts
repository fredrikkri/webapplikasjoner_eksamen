import { BASE_URL, ENDPOINTS } from "@/config/config";
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
  // const course = courses.find((course) => course.slug === slug);
  // return course;
  const response = await fetch(ENDPOINTS.courses + `/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch course");
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch course");
  }

  return result.data as Course;
};

export const getAllCourses = async (): Promise<Course[]> => {
  const response = await fetch(ENDPOINTS.courses);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error.message || "Failed to fetch courses");
  }

  return result.data as Course[];
};

// Oppretter et nytt kurs og legger det til kurslisten
export const createCourse = async (data: Course): Promise<void> => {
  courses.push(data);
};
