import type { Result } from "../../types/index";
import {
  courseRepository,
  type CourseRepository,
} from "./course.repository";

import {
  validateCreateCourse,
  type CourseCreate,
  type Course,
  type CourseResponse,
  type UpdateCourse,
  type Lesson,
  LessonSchema
} from "../../types/types";

import { createCourse, createCourseResponse, createLessonResponse } from "./course.mapper";
import type { Query } from "../../lib/query";

export const createCourseService = (courseRepository: CourseRepository) => {
  const getById = async (slug: string): Promise<Result<Course | undefined>> => {
    return courseRepository.getById(slug);
  };
  
  const getLessonsById = async (id: string): Promise<Result<Lesson[] | undefined>> =>  {
    return courseRepository.getLessonsByCourseId(id);
  };

  const getLessonById = async (slug: string): Promise<Result<Lesson | undefined>> =>  {
    return courseRepository.getLessonByCourseId(slug);
  };

  const list = async (query?: Query): Promise<Result<CourseResponse[]>> => {
    const result = await courseRepository.list(query);
    if (!result.success) return result;

    return {
      ...result,
      data: result.data.map(createCourseResponse),
    };
  };

  const create = async (data: CourseCreate): Promise<Result<string>> => {
    const course = createCourse(data);

    if (!validateCreateCourse(course).success) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid Course data" },
      };
    }
    return courseRepository.create(course);
  };

  const update = async (data: UpdateCourse) => {
    const course = createCourse(data);

    if (!validateCreateCourse(course).success) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid Course data" },
      };
    }

    return courseRepository.update(course);
  };

  const remove = async (id: string) => {
    return courseRepository.remove(id);
  };

  const listLessons = async (query?: Query): Promise<Result<Lesson[]>> => {
    const result = await courseRepository.listLesson(query);
    
    if (!result.success) {
      return result;
    }

    return {
      ...result,
      data: result.data.map(createLessonResponse),
    };
  };

  const updateLesson = async (courseSlug: string, lessonSlug: string, data: Partial<Lesson>) => {
    return courseRepository.updateLesson(courseSlug, lessonSlug, data);
  };

  const removeLesson = async (courseSlug: string, lessonSlug: string) => {
    return courseRepository.removeLesson(courseSlug, lessonSlug);
  };

  return {
    list,
    create,
    update,
    getById,
    getLessonsById,
    getLessonById,
    remove,
    listLessons,
    updateLesson,
    removeLesson
  };
};

export const courseService = createCourseService(courseRepository);

export type CourseService = ReturnType<typeof createCourseService>;
