import { db, type DB } from "../../features/db";
import {type CourseCreate, type Course, type UpdateCourse} from "../../types/course";
import {type Lesson, type LessonSchema} from "../../types/lesson";
import type { Result } from "../../types/index";
import { fromDb, fromDbLession, toDb } from "./course.mapper";
import type { Query } from "../../lib/query";
import { CourseCreateSteps } from "@/types/types";
import { CourseCreateStepsResponse } from "@/types/courseCreateSteps";

export const createCourseRepository = (db: DB) => {

  const exist = async (slug: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM courses WHERE slug = ?"
    );
    const data = query.get(slug) as { count: number };
    return data.count > 0;
  };

  const lessonExist = async (slug: string): Promise<boolean> => {
    const query = db.prepare(
      "SELECT COUNT(*) as count FROM lessons WHERE slug = ?"
    );
    const data = query.get(slug) as { count: number };
    return data.count > 0;
  };

// SRC: kilde: chatgpt.com  || med endringer /
const getLessonsByCourseId = async (id: string): Promise<Result<Lesson[]>> => {
  try {
    const courseExists = await exist(id);
    if (!courseExists) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Course not found" },
      };
    }

    const query = db.prepare("SELECT * FROM lessons WHERE course_id = ?");
    const lessons = query.all(id) as Lesson[];

    if (lessons.length === 0) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "No lessons found for this course" },
      };
    }

    const lessonsWithTexts = await Promise.all(
      lessons.map(async (lesson) => {
        const text = await fetchTextsForLesson(lesson.id);

        return {
          ...fromDbLession(lesson),
          text: text,
        };
      })
    );

    return {
      success: true,
      data: lessonsWithTexts,
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

const getCommentsByLessonSlug = async (lessonSlug: string): Promise<Result<Comment[]>> => {
  try {
    const lessonExists = await lessonExist(lessonSlug);
    if (!lessonExists) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Course not found" },
      };
    }

    const query = db.prepare("SELECT * FROM comments WHERE lesson_slug = ?");
    const comments = query.all(lessonSlug) as Comment[];

    if (comments.length === 0) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "No comments found for this lesson" },
      };
    }
    
    return {
      success: true,
      data: comments,
    };

  } catch (error) {
    console.error("Error fetching lesson:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching lesson",
      },
    };
  }
}

// SRC: kilde: chatgpt.com || med endringer /
const getLessonByCourseId = async (slug: string): Promise<Result<Lesson | undefined>> => {
  try {
    const courseExists = await lessonExist(slug);
    if (!courseExists) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Course not found" },
      };
    }

    const query = db.prepare("SELECT * FROM lessons WHERE slug = ?");
    const lessons = query.all(slug) as Lesson[];

    if (lessons.length === 0) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "No lessons found for this course" },
      };
    }

    const lessonWithTexts = await (async () => {
      const lesson = lessons[0];
      const texts = await fetchTextsForLesson(lesson.id);

      return {
        ...fromDbLession(lesson),
        text: texts,
      };
    })();

    return {
      success: true,
      data: lessonWithTexts,
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


// SRC: kilde: chatgpt.com  || med endringer /
const fetchCourses = async (params?: Query): Promise<Course[]> => {
  const { name, pageSize = 10, page = 0 } = params ?? {};
  const offset = (Number(page) - 1) * Number(pageSize);

  let query = "SELECT * FROM courses";
  query += name ? ` WHERE title LIKE '%${name}%'` : "";
  query += ` LIMIT ${pageSize}`;
  query += ` OFFSET ${offset}`;

  const statement = db.prepare(query);
  return statement.all() as Course[];
};

// SRC: kilde: chatgpt.com /
const fetchLessonsForCourse = async (courseId: string): Promise<Lesson[]> => {
  const lessonsStatement = db.prepare("SELECT * FROM lessons WHERE course_id = ?");
  return lessonsStatement.all(courseId) as Lesson[];
};

// SRC: kilde: chatgpt.com  || med justeringer /
const fetchTextsForLesson = async (lessonId: string): Promise<{ id: string; text: string; }[]> => {
  const textStatement = db.prepare("SELECT id, text FROM texts WHERE lesson_id = ?");
  return textStatement.all(lessonId) as { id: string; text: string; }[];
};

const listCourseCreateSteps = async (): Promise<Result<CourseCreateSteps[]>> => {
  try {
    const CourseCreateStepsQuery = db.prepare("SELECT * FROM courseCreateSteps");
    const data = CourseCreateStepsQuery.all() as CourseCreateSteps[];
    return { success: true, data };
  } catch  {
    return { success: false, 
      error:{code: "NOT_FOUND", message: "courseCreateSteps not found"} };
  }
};

// SRC: kilde: chatgpt.com  || med justeringer /
const getById = async (slug: string): Promise<Result<Course>> => {
  try {
    const courseExists = await exist(slug);
    if (!courseExists) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Course not found" },
      };
    }

    const query = db.prepare("SELECT * FROM courses WHERE slug = ?");
    const courseData = query.get(slug) as Course;  

    const lessons = await fetchLessonsForCourse(courseData.id);

    const lessonsWithTexts = await Promise.all(
      lessons.map(async (lesson) => {
        const text = await fetchTextsForLesson(lesson.id);

        return {
          ...fromDbLession(lesson),
          text: text,
        };
      })
    );

    return {
      success: true,
      data: {
        ...fromDb(courseData),
        lessons: lessonsWithTexts,
      },
    };
  } catch (error) {
    console.error("Error fetching course:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching course",
      },
    };
  }
};


// SRC: kilde: chatgpt.com || med endringer/
const list = async (params?: Query): Promise<Result<Course[]>> => {
  try {
    const courses = await fetchCourses(params);
    const { name, pageSize = 10, page = 0 } = params ?? {};

    const offset = (Number(page) - 1) * Number(pageSize);
    const hasPagination = Number(page) > 0;

    let query = "SELECT * FROM courses";
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

    const { total } = db.prepare("SELECT COUNT(*) as total FROM courses").get() as { total: number };
    const totalPages = Math.ceil(total / Number(pageSize));
    const hasNextPage = Number(page) < totalPages;
    const hasPreviousPage = Number(page ?? 1) > 1;

    const coursesWithLessons = await Promise.all(
      courses.map(async (course) => {
        const lessons = await fetchLessonsForCourse(course.id);
        const lessonsWithTexts = await Promise.all(
          lessons.map(async (lesson) => {
            const text = await fetchTextsForLesson(lesson.id);
            return {
              ...fromDbLession(lesson),
              text,
            };
          })
        );

        return {
          ...fromDb(course),
          lessons: lessonsWithTexts,
          ...(hasPagination ? { total: lessons.length, pageSize, page, totalPages, hasNextPage, hasPreviousPage } : {}),
        };
      })
    );

    return {
      success: true,
      data: coursesWithLessons,
      ...(hasPagination ? { total: lessons.length, pageSize, page, totalPages, hasNextPage, hasPreviousPage } : {}),
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Error fetching courses",
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
        SET title = ?, slug = ?, description = ?, category = ?
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


  return { create, list, getById, update, remove, listLesson, getLessonsByCourseId, getLessonByCourseId, getCommentsByLessonSlug, listCourseCreateSteps};
};

export const courseRepository = createCourseRepository(db);

export type CourseRepository = ReturnType<typeof createCourseRepository>;