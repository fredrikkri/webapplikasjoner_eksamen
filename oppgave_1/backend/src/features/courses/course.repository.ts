import { db, type DB } from "../../features/db";
import {
  type CourseCreate,
  type Course,
  type UpdateCourse,
  type Lesson,
  LessonSchema,
} from "../../types/types";

import type { Result } from "../../types/index";
import { fromDb, fromDbLession, toDb } from "./course.mapper";
import type { Query } from "../../lib/query";

export const createCourseRepository = (db: DB) => {

  const exist = async (id: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM courses WHERE id = ?"
    );
    const data = query.get(id) as { count: number };
    return data.count > 0;
  };

  const getById = async (id: string): Promise<Result<Course>> => {
    try {
      const course = await exist(id);
      if (!course)
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Courses not found" },
        };
      const query = db.prepare("SELECT * FROM courses WHERE id = ?");
      const data = query.get(id) as Course;
      return {
        success: true,
        data: fromDb(data),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med henting av Course",
        },
      };
    }
  };

  // SRC: kilde: chatgpt.com  || bug fixing /
  const getLessonsByCourseId = async (id: string): Promise<Result<Lesson[]>> => {
    try {
        const courseExists = await exist(id);
        const query = db.prepare("SELECT * FROM lessons WHERE course_id = ?");
        const lessons = query.all(id) as Lesson[];
        const data = lessons.map(fromDbLession);
        
        if (!courseExists) {
            return {
                success: false,
                error: { code: "NOT_FOUND", message: "Course not found" }
            };
        }

        if (lessons.length === 0) {
            return {
                success: false,
                error: { code: "NOT_FOUND", message: "No lessons found for this course" }
            };
        }

        return {
            success: true,
            data: data,
        };
    } catch (error) {
        console.error("Error fetching lessons:", error);
        return {
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error fetching lessons",
            },
        };
    }
};


const list = async (params?: Query): Promise<Result<Course[]>> => {
  try {
    const { name, pageSize = 10, page = 0 } = params ?? {};

    const offset = (Number(page) - 1) * Number(pageSize);
    const hasPagination = Number(page) > 0;

    let query = "SELECT * FROM courses";
    query += name ? ` WHERE name LIKE '%${name}%'` : "";
    query += pageSize ? ` LIMIT ${pageSize}` : "";
    query += offset ? ` OFFSET ${offset}` : "";

    const statement = db.prepare(query);
    const data = statement.all() as Course[];

    // SRC: kilde: chatgpt.com /
    const coursesWithLessons = await Promise.all(
      data.map(async (course) => {
        const lessonsStatement = db.prepare(
          "SELECT * FROM lessons WHERE course_id = ?"
        );
        const lessons = lessonsStatement.all(course.id) as Lesson[];

        return {
          ...fromDb(course),
          lessons: lessons.map(fromDbLession),
        };
      })
    );
    const { total } = db
      .prepare("SELECT COUNT(*) as total from courses")
      .get() as { total: number };

    const totalPages = Math.ceil(total / Number(pageSize ?? 1));
    const hasNextPage = Number(page) < totalPages;
    const hasPreviousPage = Number(page ?? 1) > 1;

    return {
      success: true,
      data: coursesWithLessons,
      ...(hasPagination
        ? {
            total: data.length,
            pageSize,
            page,
            totalPages,
            hasNextPage,
            hasPreviousPage,
          }
        : {}),
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Feil med henting av Courses",
      },
    };
  }
};

  const create = async (data: CourseCreate): Promise<Result<string>> => {
    try {
      const course = toDb(data);

      const query = db.prepare(`
        INSERT INTO courses (id, title, slug, description, lessons, category)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      query.run(
        course.id,
        course.title,
        course.slug,
        course.description,
        course.lessons,
        course.category
      );
      return {
        success: true,
        data: course.id,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med oppretting av course",
        },
      };
    }
  };

  const update = async (data: UpdateCourse): Promise<Result<Course>> => {
    try {
      const courseExist = await exist(data.id);

      if (!courseExist)
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Course not found" },
        };

      const course = toDb(data);

      const query = db.prepare(`
        UPDATE courses
        SET id = ?, title = ?, slug = ?, description = ?, category = ?
        WHERE id = ?
      `);
      query.run(course.id, course.title, course.slug, course.description, course.category);
      return {
        success: true,
        data: fromDb(course),
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med oppdatering av Course",
        },
      };
    }
  };

  const remove = async (id: string): Promise<Result<string>> => {
    try {
      const course = await exist(id);
      if (!course)
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Course not found" },
        };
      const query = db.prepare("DELETE FROM courses WHERE id = ?");
      query.run(id);
      return {
        success: true,
        data: id,
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Feil med sletting av course",
        },
      };
    }
  };

// SRC: kilde: chatgpt.com /
  const listLesson = async (params?: Query): Promise<Result<Lesson[]>> => {
    try {
        const { name, pageSize = 10, page = 0 } = params ?? {};

        const offset = (Number(page) - 1) * Number(pageSize);
        const hasPagination = Number(page) > 0;

        let query = "SELECT * FROM lessons";
        const conditions: string[] = [];

        if (name) {
            conditions.push(`title LIKE '%${name}%'`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        query += ` LIMIT ${pageSize}`;
        query += ` OFFSET ${offset}`;

        const statement = db.prepare(query);
        const data = statement.all() as any[];

        const lessons = data.map(fromDbLession);

        const { total } = db.prepare("SELECT COUNT(*) as total FROM lessons").get() as { total: number };
        const totalPages = Math.ceil(total / Number(pageSize));
        const hasNextPage = Number(page) < totalPages;
        const hasPreviousPage = Number(page ?? 1) > 1;

        return {
            success: true,
            data: lessons,
            ...(hasPagination ? { total: lessons.length, pageSize, page, totalPages, hasNextPage, hasPreviousPage } : {}),
        };
    } catch (error) {
        console.error("Error fetching lessons:", error);
        return {
            success: false,
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "Error fetching lessons",
            },
        };
    }
};


  return { create, list, getById, update, remove, listLesson, getLessonsByCourseId};
};

export const courseRepository = createCourseRepository(db);

export type CourseRepository = ReturnType<typeof createCourseRepository>;