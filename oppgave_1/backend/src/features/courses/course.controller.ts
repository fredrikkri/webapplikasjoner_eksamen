import { Hono } from "hono";
import { courseService, type CourseService } from "./course.service";
import { errorResponse, type ErrorCode } from "../../lib/error";
import { validateQuery } from "../../lib/query";
import type { Result, Failure } from "../../types";
import type { Course } from "../../types/course";
import type { Lesson } from "../../types/lesson";
import data from "../data/data.json";

export const createCourseController = (CourseService: CourseService) => {
  const app = new Hono();

  const isFailure = <T>(result: Result<T>): result is Failure => {
    return !result.success;
  };

  app.get("/courses", async (c) => {
    const query = validateQuery(c.req.query()).data ?? {};
    const result = await CourseService.list(query);

    if (isFailure(result)) {
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    }
    return c.json(result);
  });

  app.get("/courses/:slug", async (c) => {
    const slug = c.req.param("slug");
    const result = await CourseService.getBySlug(slug);

    if (isFailure(result)) {
      return errorResponse(
        c,
        result.error.code as ErrorCode,
        result.error.message
      );
    }
    return c.json(result);
  });

  app.post("/courses", async (c) => {
    try {
      const data = await c.req.json();
      console.log('Received course data:', JSON.stringify(data, null, 2));
      
      const result = await CourseService.create(data);
      
      if (isFailure(result)) {
        console.error('Course creation failed:', result.error);
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      }

      // After successful creation, fetch the complete course data
      const courseResult = await CourseService.getBySlug(result.data);
      if (isFailure(courseResult) || !courseResult.data) {
        return errorResponse(
          c,
          'INTERNAL_SERVER_ERROR',
          'Failed to fetch created course'
        );
      }

      const response: Result<Course> = {
        success: true,
        data: courseResult.data
      };
      return c.json(response, { status: 201 });
    } catch (error) {
      console.error('Error in course creation:', error);
      return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        error instanceof Error ? error.message : 'Failed to create course'
      );
    }
  });

  app.patch("/courses/:slug", async (c) => {
    try {
      const slug = c.req.param("slug");
      const data = await c.req.json();

      const result = await CourseService.update({ 
        ...data,
        slug
      });

      if (isFailure(result)) {
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      }

      const response: Result<Course> = {
        success: true,
        data: result.data
      };
      return c.json(response);
    } catch (error) {
      console.error('Error in course update:', error);
      return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        error instanceof Error ? error.message : 'Failed to update course'
      );
    }
  });

  app.delete("/courses/:slug", async (c) => {
    try {
      const slug = c.req.param("slug");
      const result = await CourseService.remove(slug);
      
      if (isFailure(result)) {
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      }

      const response: Result<string> = {
        success: true,
        data: result.data
      };
      return c.json(response);
    } catch (error) {
      console.error('Error in course deletion:', error);
      return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        error instanceof Error ? error.message : 'Failed to delete course'
      );
    }
  });

  app.get("/courses/:slug/:slugLesson", async (c) => {
    try {
      const slug = c.req.param("slug");
      const slugLesson = c.req.param("slugLesson");
      
      const courseResult = await CourseService.getBySlug(slug);
      if (isFailure(courseResult)) {
        return errorResponse(
          c,
          courseResult.error.code as ErrorCode,
          courseResult.error.message
        );
      }

      const lessonResult = await CourseService.getLessonById(slugLesson);
      if (isFailure(lessonResult) || !lessonResult.data) {
        return errorResponse(
          c,
          isFailure(lessonResult) ? lessonResult.error.code as ErrorCode : 'NOT_FOUND',
          isFailure(lessonResult) ? lessonResult.error.message : 'Lesson not found'
        );
      }

      const response: Result<Lesson> = {
        success: true,
        data: lessonResult.data
      };
      return c.json(response);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        error instanceof Error ? error.message : 'Failed to fetch lesson'
      );
    }
  });

  app.patch("/courses/:courseSlug/lessons/:lessonSlug", async (c) => {
    try {
      const courseSlug = c.req.param("courseSlug");
      const lessonSlug = c.req.param("lessonSlug");
      const data = await c.req.json();

      const result = await CourseService.updateLesson(courseSlug, lessonSlug, data);
      if (isFailure(result)) {
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      }

      const response: Result<Lesson> = {
        success: true,
        data: result.data
      };
      return c.json(response);
    } catch (error) {
      console.error('Error updating lesson:', error);
      return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        error instanceof Error ? error.message : 'Failed to update lesson'
      );
    }
  });

  app.delete("/courses/:courseSlug/lessons/:lessonSlug", async (c) => {
    try {
      const courseSlug = c.req.param("courseSlug");
      const lessonSlug = c.req.param("lessonSlug");

      const result = await CourseService.removeLesson(courseSlug, lessonSlug);
      if (isFailure(result)) {
        return errorResponse(
          c,
          result.error.code as ErrorCode,
          result.error.message
        );
      }

      const response: Result<string> = {
        success: true,
        data: result.data
      };
      return c.json(response);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      return errorResponse(
        c,
        'INTERNAL_SERVER_ERROR',
        error instanceof Error ? error.message : 'Failed to delete lesson'
      );
    }
  });

  return app;
};

export const CourseController = createCourseController(courseService);