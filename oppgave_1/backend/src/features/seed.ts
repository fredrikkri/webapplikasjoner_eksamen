import { DB } from "./db";
import { join } from "path";
import { promises } from "fs";

export const seed = async (db: DB) => {
  const path = join(process.cwd(), "src", "features", "data", "data.json");
  const file = await promises.readFile(path, "utf8");
  const { courses, comments, users, categories, courseCreateSteps } = JSON.parse(file);

  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, slug, description, category)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, title, slug, preAmble, course_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertText = db.prepare(`
    INSERT INTO texts (id, text, lesson_id)
    VALUES (?, ?, ?)
  `);

  const insertComment = db.prepare(`
    INSERT INTO comments (id, createdBy, comment, lesson_id)
    VALUES (?, ?, ?, ?)
  `);

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email)
    VALUES (?, ?, ?)
  `);

  const insertCourseCreateSteps = db.prepare(`
    INSERT INTO courseCreateSteps (id, name)
    VALUES (?, ?)
  `);

  const insertCategory = db.prepare(`
    INSERT INTO categories (name) VALUES (?);
  `);

  // Use a transaction to ensure all-or-nothing insertion
  db.transaction(() => {
    // Clear existing data
    db.prepare('DELETE FROM texts').run();
    db.prepare('DELETE FROM comments').run();
    db.prepare('DELETE FROM lessons').run();
    db.prepare('DELETE FROM courses').run();
    db.prepare('DELETE FROM users').run();
    db.prepare('DELETE FROM categories').run();
    db.prepare('DELETE FROM courseCreateSteps').run();

    // Insert users
    for (const user of users) {
      insertUser.run(user.id, user.name, user.email);
    }

    // Insert categories
    for (const category of categories) {
      const normalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      insertCategory.run(normalizedCategory);
    }

    // Insert course create steps
    for (const step of courseCreateSteps) {
      insertCourseCreateSteps.run(step.id, step.name);
    }

    // Insert courses and their lessons
    for (const course of courses) {
      const normalizedCategory = course.category.charAt(0).toUpperCase() + course.category.slice(1).toLowerCase();
      
      insertCourse.run(
        course.id,
        course.title,
        course.slug,
        course.description,
        normalizedCategory
      );

      // Insert lessons for this course
      for (const lesson of course.lessons) {
        insertLesson.run(
          lesson.id,
          lesson.title,
          lesson.slug,
          lesson.preAmble,
          course.id
        );

        // Insert texts for this lesson
        if (lesson.text && lesson.text.length > 0) {
          for (const text of lesson.text) {
            insertText.run(text.id, text.text, lesson.id);
          }
        }
      }
    }

    // Insert comments with createdBy as JSON string
    for (const comment of comments) {
      const createdByJson = JSON.stringify({
        id: comment.createdBy.id,
        name: comment.createdBy.name
      });

      insertComment.run(
        comment.id,
        createdByJson,
        comment.comment,
        comment.lesson.id
      );
    }
  })();
};
