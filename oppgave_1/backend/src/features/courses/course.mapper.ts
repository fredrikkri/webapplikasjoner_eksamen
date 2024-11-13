import type { Course } from "../../types/course";
import type { Lesson } from "../../types/lesson";

const createId = () => {
  return crypto.randomUUID();
};

export const createCourseResponse = (course: Course): Course => {
  const {
    id,
    title,
    slug,
    description,
    category,
    lessons
  } = course;

  return {
    id,
    title,
    slug,
    description,
    category,
    lessons: lessons?.map(lesson => createLessonResponse(lesson)) ?? []
  };
};

export const createLessonResponse = (lesson: Lesson): Lesson => {
  const {
    id,
    title,
    slug,
    preAmble,
    text,
  } = lesson;

  return {
    id,
    title,
    slug,
    preAmble,
    text: Array.isArray(text) ? text.map(t => ({
      id: t.id ?? createId(),
      text: t.text
    })) : []
  };
};

export const fromDb = (course: Course): Course => {
  return {
    id: course.id,
    title: course.title ?? "",
    slug: course.slug ?? "",
    description: course.description ?? "",
    category: course.category ?? "",
    lessons: Array.isArray(course.lessons) ? course.lessons.map(lesson => fromDbLession(lesson)) : []
  };
};

export const fromDbLession = (lesson: Lesson): Lesson => {
  return {
    id: lesson.id?.toString() ?? createId(),
    title: lesson.title ?? "",
    slug: lesson.slug ?? "",
    preAmble: lesson.preAmble ?? "",
    text: Array.isArray(lesson.text) ? lesson.text.map(t => ({
      id: t.id ?? createId(),
      text: t.text ?? ""
    })) : []
  };
};

export const createCourse = (course: Partial<Course>): Course => {
  const courseId = course.id ?? createId();

  return {
    id: courseId,
    title: course.title ?? "",
    slug: course.slug ?? "",
    description: course.description ?? "",
    category: course.category ?? "",
    lessons: Array.isArray(course.lessons) ? course.lessons.map(lesson => ({
      id: lesson.id ?? createId(),
      title: lesson.title ?? "",
      slug: lesson.slug ?? "",
      preAmble: lesson.preAmble ?? "",
      text: Array.isArray(lesson.text) ? lesson.text.map(t => ({
        id: t.id ?? createId(),
        text: t.text ?? ""
      })) : []
    })) : []
  };
};

export const toDb = (data: Partial<Course>): Course => {
  const courseId = data.id ?? createId();

  return {
    id: courseId,
    title: data.title ?? "",
    slug: data.slug ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    lessons: Array.isArray(data.lessons) ? data.lessons.map(lesson => ({
      id: lesson.id ?? createId(),
      title: lesson.title ?? "",
      slug: lesson.slug ?? "",
      preAmble: lesson.preAmble ?? "",
      text: Array.isArray(lesson.text) ? lesson.text.map(t => ({
        id: t.id ?? createId(),
        text: t.text ?? ""
      })) : []
    })) : []
  };
};
