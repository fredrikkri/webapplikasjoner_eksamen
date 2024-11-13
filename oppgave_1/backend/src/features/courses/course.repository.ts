import { db, type DB } from "../../features/db";
import { type CourseCreate, type Course, type UpdateCourse } from "../../types/course";
import { type Lesson, type LessonSchema } from "../../types/lesson";
import type { Result } from "../../types/index";
import { fromDb, fromDbLession, toDb } from "./course.mapper";
import type { Query } from "../../lib/query";
import { generateSlug } from "../../lib/utils";

export const createCourseRepository = (db: DB) => {
  const exist = async (slug: string): Promise<boolean> => {
    try {
      const query = db.prepare("SELECT COUNT(*) as count FROM courses WHERE slug = ?");
      const data = query.get(slug) as { count: number };
      return data.count > 0;
    } catch (error) {
      console.error("Error checking existence:", error);
      return false;
    }
  };

  const existId = async (id: string): Promise<boolean> => {
    try {
      const query = db.prepare("SELECT COUNT(*) as count FROM courses WHERE id = ?");
      const data = query.get(id) as { count: number };
      return data.count > 0;
    } catch (error) {
      console.error("Error checking existence:", error);
      return false;
    }
  };

  const lessonExist = async (slug: string): Promise<boolean> => {
    try {
      const query = db.prepare("SELECT COUNT(*) as count FROM lessons WHERE slug = ?");
      const data = query.get(slug) as { count: number };
      return data.count > 0;
    } catch (error) {
      console.error("Error checking lesson existence:", error);
      return false;
    }
  };
  
  const getLessonsByCourseId = async (id: string): Promise<Result<Lesson[]>> => {
    try {
      const courseExists = await exist(id);
      if (!courseExists) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Course not found" },
        };
      }

      const query = db.prepare(`
        SELECT l.*, GROUP_CONCAT(t.text) as texts, GROUP_CONCAT(t.id) as text_ids
        FROM lessons l
        LEFT JOIN texts t ON l.id = t.lesson_id
        WHERE l.course_id = ?
        GROUP BY l.id
      `);
      
      const lessons = query.all(id) as any[];

      if (lessons.length === 0) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "No lessons found for this course" },
        };
      }

      const processedLessons = lessons.map(lesson => {
        const texts = lesson.texts ? lesson.texts.split(',') : [];
        const textIds = lesson.text_ids ? lesson.text_ids.split(',') : [];
        
        return {
          ...fromDbLession(lesson),
          text: texts.map((text: string, index: number) => ({
            id: textIds[index],
            text: text
          }))
        };
      });

      return {
        success: true as const,
        data: processedLessons,
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

  const getLessonById = async (slug: string): Promise<Result<Lesson | undefined>> => {
    try {
      const lessonExists = await lessonExist(slug);
      if (!lessonExists) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Lesson not found" },
        };
      }

      const query = db.prepare(`
        SELECT l.*, GROUP_CONCAT(t.text) as texts, GROUP_CONCAT(t.id) as text_ids
        FROM lessons l
        LEFT JOIN texts t ON l.id = t.lesson_id
        WHERE l.slug = ?
        GROUP BY l.id
      `);
      
      const lesson = query.get(slug) as any;

      if (!lesson) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Lesson not found" },
        };
      }

      const texts = lesson.texts ? lesson.texts.split(',') : [];
      const textIds = lesson.text_ids ? lesson.text_ids.split(',') : [];
      
      const processedLesson = {
        ...fromDbLession(lesson),
        text: texts.map((text: string, index: number) => ({
          id: textIds[index],
          text: text
        }))
      };

      return {
        success: true as const,
        data: processedLesson,
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
  };

  const getBySlug = async (slug: string): Promise<Result<Course>> => {
    try {
      const exists = await exist(slug);
      if (!exists) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Course not found exist" },
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
        success: true as const,
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

  const getById = async (id: string): Promise<Result<Course>> => {
    try {
      const exists = await existId(id);
      if (!exists) {
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Course not found exist" },
        };
      }

      const query = db.prepare("SELECT * FROM courses WHERE id = ?");
      const courseData = query.get(id) as Course;

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
        success: true as const,
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

  const list = async (params?: Query): Promise<Result<Course[]>> => {
    try {
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
      const courses = statement.all() as Course[];

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
          };
        })
      );

      const { total } = db.prepare("SELECT COUNT(*) as total FROM courses").get() as { total: number };
      const totalPages = Math.ceil(total / Number(pageSize));
      const hasNextPage = Number(page) < totalPages;
      const hasPreviousPage = Number(page ?? 1) > 1;

      return {
        success: true as const,
        data: coursesWithLessons,
        ...(hasPagination ? { total, pageSize, page, totalPages, hasNextPage, hasPreviousPage } : {}),
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
      const lessons = statement.all() as Lesson[];

      const lessonsWithTexts = await Promise.all(
        lessons.map(async (lesson) => {
          const texts = await fetchTextsForLesson(lesson.id);
          return {
            ...fromDbLession(lesson),
            text: texts,
          };
        })
      );

      const { total } = db.prepare("SELECT COUNT(*) as total FROM lessons").get() as { total: number };
      const totalPages = Math.ceil(total / Number(pageSize));
      const hasNextPage = Number(page) < totalPages;
      const hasPreviousPage = Number(page ?? 1) > 1;

      return {
        success: true as const,
        data: lessonsWithTexts,
        ...(hasPagination ? { total, pageSize, page, totalPages, hasNextPage, hasPreviousPage } : {}),
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

  const fetchLessonsForCourse = async (courseId: string): Promise<Lesson[]> => {
    const lessonsStatement = db.prepare("SELECT * FROM lessons WHERE course_id = ?");
    return lessonsStatement.all(courseId) as Lesson[];
  };

  const fetchTextsForLesson = async (lessonId: string): Promise<{ id: string; text: string; }[]> => {
    const textStatement = db.prepare("SELECT id, text FROM texts WHERE lesson_id = ?");
    return textStatement.all(lessonId) as { id: string; text: string; }[];
  };

  const create = async (data: CourseCreate): Promise<Result<string>> => {
    const db_transaction = db.transaction(() => {
      try {
        const generatedSlug = generateSlug(data.title);
        const slugExists = db.prepare("SELECT COUNT(*) as count FROM courses WHERE slug = ?").get(generatedSlug) as { count: number };
        if (slugExists.count > 0) {
          throw new Error(`Course with slug '${generatedSlug}' already exists`);
        }
  
        const course = toDb({
          ...data,
          slug: generatedSlug
        });
  
        console.log('Creating course with data:', JSON.stringify(course, null, 2));
  
        const courseQuery = db.prepare(`
          INSERT INTO courses (id, title, slug, description, category)
          VALUES (?, ?, ?, ?, ?)
        `);
  
        try {
          courseQuery.run(
            course.id,
            course.title.trim(),
            course.slug.toLowerCase(),
            course.description.trim(),
            course.category
          );
          console.log(`Inserted course with ID: ${course.id}`);
        } catch (error) {
          console.error('Error inserting course:', error);
          throw new Error('Failed to insert course data');
        }
  
        if (Array.isArray(course.lessons) && course.lessons.length > 0) {
          const lessonQuery = db.prepare(`
            INSERT INTO lessons (id, title, slug, preAmble, course_id)
            VALUES (?, ?, ?, ?, ?)
          `);
  
          const textQuery = db.prepare(`
            INSERT INTO texts (id, text, lesson_id)
            VALUES (?, ?, ?)
          `);
  
          course.lessons.forEach((lesson) => {
            const courseExists = db.prepare("SELECT id FROM courses WHERE id = ?").get(course.id);
            if (!courseExists) {
              throw new Error(`Course with ID ${course.id} does not exist`);
            }
  
            try {
              lessonQuery.run(
                lesson.id,
                lesson.title.trim(),
                lesson.slug.toLowerCase(),
                lesson.preAmble.trim(),
                course.id
              );
  
              console.log(`Inserted lesson with ID: ${lesson.id}`);
  
              if (Array.isArray(lesson.text) && lesson.text.length > 0) {
                lesson.text.forEach((textItem) => {
                  try {
                    textQuery.run(textItem.id, textItem.text.trim(), lesson.id);
                    console.log(`Inserted text for lesson ID: ${lesson.id}`);
                  } catch (error) {
                    console.error(`Error inserting text for lesson ${lesson.slug}:`, error);
                    throw new Error(`Failed to insert text for lesson ${lesson.slug}`);
                  }
                });
              }
            } catch (error) {
              console.error(`Error inserting lesson ${lesson.slug}:`, error);
              throw new Error(`Failed to insert lesson ${lesson.slug}`);
            }
          });
        }
  
        return {
          success: true as const,
          data: course.id,
        };
      } catch (error) {
        console.error("Error in create transaction:", error);
        throw error;
      }
    });
  
    try {
      return db_transaction();
    } catch (error) {
      console.error("Course creation failed:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Error creating course",
        },
      };
    }
  };

  const update = async (data: UpdateCourse): Promise<Result<Course>> => {
    console.log("data repo update", data)
    try {
      const existingCourseResult = await getById(data.id);
      if (!existingCourseResult.success || !existingCourseResult.data) {
        console.error(`Course not found with id: ${data.id}`);
        return {
          success: false,
          error: { code: "NOT_FOUND", message: "Course not found EE" },
        };
      }
  
      const existingCourse = existingCourseResult.data;
  
      const course = toDb({
        ...data,
        id: existingCourse.id,
      });
  
      console.log('Updating course:', {
        existingId: existingCourse.id,
        existingSlug: existingCourse.slug,
        newSlug: course.slug,
        newTitle: course.title,
      });
  
      const db_transaction = db.transaction(() => {
        const updateQuery = db.prepare(`
          UPDATE courses
          SET title = ?, slug = ?, description = ?, category = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `);
        updateQuery.run(
          course.title.trim(),
          course.slug.toLowerCase(),
          course.description.trim(),
          course.category,
          existingCourse.id
        );
  
        if (course.lessons && course.lessons.length > 0) {
          const updateLessonQuery = db.prepare(`
            UPDATE lessons
            SET title = ?, slug = ?, preAmble = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND course_id = ?
          `);
  
          const deleteTextsQuery = db.prepare("DELETE FROM texts WHERE lesson_id = ?");
          const insertTextQuery = db.prepare(`
            INSERT INTO texts (id, text, lesson_id, created_at, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `);
  
          course.lessons.forEach((lesson) => {
            console.log('Updating lesson:', {
              lessonId: lesson.id,
              lessonSlug: lesson.slug,
              courseId: existingCourse.id,
            });
  
            updateLessonQuery.run(
              lesson.title.trim(),
              lesson.slug.toLowerCase(),
              lesson.preAmble.trim(),
              lesson.id,
              existingCourse.id
            );
  
            deleteTextsQuery.run(lesson.id);
  
            lesson.text.forEach((textItem) => {
              insertTextQuery.run(
                textItem.id,
                textItem.text.trim(),
                lesson.id
              );
            });
          });
        }
      });
  
      db_transaction();
  
      const updatedCourseResult = await getBySlug(course.slug);
      if (!updatedCourseResult.success) {
        throw new Error("Failed to fetch updated course");
      }
  
      return {
        success: true as const,
        data: updatedCourseResult.data,
      };
    } catch (error) {
      console.error("Error updating course:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Error updating course",
        },
      };
    }
  };

  const remove = async (slug: string): Promise<Result<string>> => {
    const db_transaction = db.transaction(() => {
      try {
        const courseQuery = db.prepare("SELECT id FROM courses WHERE slug = ?");
        const course = courseQuery.get(slug) as { id: string } | undefined;

        if (!course) {
          throw new Error("Course not found");
        }

        const deleteTextsQuery = db.prepare(`
          DELETE FROM texts 
          WHERE lesson_id IN (
            SELECT id FROM lessons WHERE course_id = ?
          )
        `);
        deleteTextsQuery.run(course.id);

        const deleteLessonsQuery = db.prepare("DELETE FROM lessons WHERE course_id = ?");
        deleteLessonsQuery.run(course.id);

        const deleteCourseQuery = db.prepare("DELETE FROM courses WHERE id = ?");
        deleteCourseQuery.run(course.id);

        return slug;
      } catch (error) {
        console.error("Error in delete transaction:", error);
        throw error;
      }
    });

    try {
      const result = db_transaction();
      return {
        success: true as const,
        data: result,
      };
    } catch (error) {
      if (error instanceof Error && error.message === "Course not found") {
        return {
          success: false as const,
          error: { code: "NOT_FOUND", message: "Course not found" },
        };
      }
      return {
        success: false as const,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting course",
        },
      };
    }
  };

  const updateLesson = async (courseSlug: string, lessonSlug: string, data: Partial<Lesson>): Promise<Result<Lesson>> => {
    const db_transaction = db.transaction(() => {
      try {
        const lessonQuery = db.prepare(`
          SELECT l.* FROM lessons l
          JOIN courses c ON l.course_id = c.id
          WHERE c.slug = ? AND l.slug = ?
        `);
        const lesson = lessonQuery.get(courseSlug, lessonSlug) as { id: string } | undefined;

        if (!lesson) {
          throw new Error("Lesson not found or does not belong to the specified course");
        }

        const updateLessonQuery = db.prepare(`
          UPDATE lessons
          SET title = COALESCE(?, title),
              preAmble = COALESCE(?, preAmble),
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
          RETURNING *
        `);

        const updatedLessonData = updateLessonQuery.get(
          data.title?.trim(),
          data.preAmble?.trim(),
          lesson.id
        ) as Lesson;

        if (data.text && data.text.length > 0) {
          const deleteTextsQuery = db.prepare("DELETE FROM texts WHERE lesson_id = ?");
          deleteTextsQuery.run(lesson.id);

          const insertTextQuery = db.prepare(`
            INSERT INTO texts (id, text, lesson_id, created_at, updated_at)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `);

          data.text.forEach((textItem) => {
            insertTextQuery.run(textItem.id, textItem.text.trim(), lesson.id);
          });
        }

        const updatedLesson = {
          ...fromDbLession(updatedLessonData),
          text: db.prepare("SELECT id, text FROM texts WHERE lesson_id = ?")
            .all(lesson.id) as { id: string; text: string }[],
        };

        return updatedLesson;
      } catch (error) {
        console.error("Error in update lesson transaction:", error);
        throw error;
      }
    });

    try {
      const result = db_transaction();
      return {
        success: true as const,
        data: result,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("Lesson not found")) {
        return {
          success: false as const,
          error: { code: "NOT_FOUND", message: error.message },
        };
      }
      return {
        success: false as const,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error updating lesson",
        },
      };
    }
  };

  const removeLesson = async (courseSlug: string, lessonSlug: string): Promise<Result<string>> => {
    const db_transaction = db.transaction(() => {
      try {
        const lessonQuery = db.prepare(`
          SELECT l.id FROM lessons l
          JOIN courses c ON l.course_id = c.id
          WHERE c.slug = ? AND l.slug = ?
        `);
        const lesson = lessonQuery.get(courseSlug, lessonSlug) as { id: string } | undefined;

        if (!lesson) {
          throw new Error("Lesson not found or does not belong to the specified course");
        }

        const deleteTextsQuery = db.prepare("DELETE FROM texts WHERE lesson_id = ?");
        deleteTextsQuery.run(lesson.id);

        const deleteLessonQuery = db.prepare("DELETE FROM lessons WHERE id = ?");
        deleteLessonQuery.run(lesson.id);

        return lessonSlug;
      } catch (error) {
        console.error("Error in delete lesson transaction:", error);
        throw error;
      }
    });

    try {
      const result = db_transaction();
      return {
        success: true as const,
        data: result,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("Lesson not found")) {
        return {
          success: false as const,
          error: { code: "NOT_FOUND", message: error.message },
        };
      }
      return {
        success: false as const,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error deleting lesson",
        },
      };
    }
  };

  return {
    create,
    list,
    getBySlug,
    update,
    remove,
    listLesson,
    getLessonsByCourseId,
    getLessonById,
    updateLesson,
    removeLesson,
  };
};

export const courseRepository = createCourseRepository(db);

export type CourseRepository = ReturnType<typeof createCourseRepository>;
