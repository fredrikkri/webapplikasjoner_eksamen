import { DB } from "./db";
import { fileURLToPath } from "url";
import { join } from "path";
import { promises } from "fs";

const __filename = fileURLToPath(import.meta.url);

export const seed = async (db: DB) => {

const path = join(".", "src", "features", "data", "data.json");
const file = await promises.readFile(path, "utf-8");
const { courses, comments, users, categories, courseCreateSteps} = JSON.parse(file);

  const insertCourse = db.prepare(`
    INSERT INTO courses (id, title, slug, description, category)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertLesson = db.prepare(`
    INSERT INTO lessons (id, title, slug, preAmble, course_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertText = db.prepare(`
    INSERT INTO texts (text, lesson_id)
    VALUES (?, ?)
  `);

  const insertComment = db.prepare(`
    INSERT INTO comments (createdBy, comment, lesson_id)
    VALUES (?, ?, ?)
  `);

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email)
    VALUES (?, ?, ?)
  `);

  const insertCourseCreateSteps = db.prepare(`
    INSERT INTO courseCreateSteps (id, name)
    VALUES (?, ?)
  `);

  // SRC: kilde: chatgpt.com /
  const insertCategory = db.prepare(`
    INSERT INTO categories (name) VALUES (?);
  `);

  // SRC: kilde: chatgpt.com || delvis /
  db.transaction(() => {
    for (const user of users) {
      insertUser.run(user.id, user.name, user.email);
    }

    for (const category of categories) {
        insertCategory.run(category);
    }

    for (const create of courseCreateSteps) {
        insertCourseCreateSteps.run(create.id, create.name);
    }

    for (const course of courses) {
      insertCourse.run(
        course.id,
        course.title,
        course.slug,
        course.description,
        course.category
    );

      for (const lesson of course.lessons) {
        insertLesson.run(
          lesson.id,
          lesson.title,
          lesson.slug,
          lesson.preAmble,
          course.id
        );


        for (const text of lesson.text) {
          insertText.run(text.text, lesson.id);
        }

        for (const comment of comments) {
          if (comment.lesson.slug === lesson.slug) {
            insertComment.run(comment.createdBy.name, comment.comment, lesson.Id);
          }
        }
      }
    }
  })();
};
