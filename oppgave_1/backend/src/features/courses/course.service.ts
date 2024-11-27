import type { Result } from "../../types/index";
import {
  courseRepository,
  type CourseRepository,
} from "./course.repository";

import {
  validateCreateCourse,
  validateUpdateCourse,
  type CourseCreate,
  type Course,
  type CourseResponse,
  type UpdateCourse } from "../../types/course"

import { 
  type Lesson,
  LessonSchema } from "../../types/lesson"

import { createCourse, createCourseResponse, createLessonResponse } from "./course.mapper";
import type { Query } from "../../lib/query";
import { generateSlug } from "../../lib/utils";

export const createCourseService = (courseRepository: CourseRepository) => {
  const getBySlug = async (slug: string): Promise<Result<Course | undefined>> => {
    return courseRepository.getBySlug(slug);
  };
  
  const getLessonsByCourseId = async (id: string): Promise<Result<Lesson[] | undefined>> =>  {
    return courseRepository.getLessonsByCourseId(id);
  };

  const getLessonById = async (slug: string): Promise<Result<Lesson | undefined>> =>  {
    return courseRepository.getLessonById(slug);
  };

  const list = async (query?: Query): Promise<Result<CourseResponse[]>> => {
    const result = await courseRepository.list(query);
    if (!result.success) return result;

    return {
      success: true,
      data: result.data.map(createCourseResponse),
      ...(result.total !== undefined ? {
        total: result.total,
        pageSize: result.pageSize,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage
      } : {})
    };
  };

  const create = async (data: CourseCreate): Promise<Result<string>> => {
    const validation = validateCreateCourse(data);
    if (!validation.success) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid Course data" },
      };
    }

    // Transform the data to include required fields
    const courseData = {
      title: data.title,
      description: data.description,
      category: data.category,
      lessons: data.lessons.map(lesson => ({
        ...lesson,
        id: crypto.randomUUID(),
        slug: generateSlug(lesson.title)
      }))
    };

    return courseRepository.create(courseData);
  };

  const update = async (data: UpdateCourse): Promise<Result<Course>> => {
    const validation = validateUpdateCourse(data);
    if (!validation.success) {
      return {
        success: false,
        error: { code: "BAD_REQUEST", message: "Invalid Course data" },
      };
    }

    const existingCourse = await courseRepository.getBySlug(data.slug);
    if (!existingCourse.success) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Course not found" },
      };
    }

    const course = createCourse({
      ...data,
      id: existingCourse.data.id
    });

    return courseRepository.update(course);
  };

  const remove = async (id: string): Promise<Result<string>> => {
    return courseRepository.remove(id);
  };

  const listLessons = async (query?: Query): Promise<Result<Lesson[]>> => {
    const result = await courseRepository.listLesson(query);
    
    if (!result.success) {
      return result;
    }

    return {
      success: true,
      data: result.data.map(createLessonResponse),
      ...(result.total !== undefined ? {
        total: result.total,
        pageSize: result.pageSize,
        page: result.page,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPreviousPage: result.hasPreviousPage
      } : {})
    };
  };

  const updateLesson = async (courseSlug: string, lessonSlug: string, data: Partial<Lesson>): Promise<Result<Lesson>> => {
    return courseRepository.updateLesson(courseSlug, lessonSlug, data);
  };

  const removeLesson = async (courseSlug: string, lessonSlug: string): Promise<Result<string>> => {
    return courseRepository.removeLesson(courseSlug, lessonSlug);
  };

  return {
    list,
    create,
    update,
    getBySlug,
    getLessonsByCourseId,
    getLessonById,
    remove,
    listLessons,
    updateLesson,
    removeLesson
  };
};

export const courseService = createCourseService(courseRepository);

export type CourseService = ReturnType<typeof createCourseService>;
