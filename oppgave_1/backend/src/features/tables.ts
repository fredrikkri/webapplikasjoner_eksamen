import { DB } from "./db";
// SRC: kilde: chatgpt.com - on delete cascade /
export const createTables = (db: DB) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        preAmble TEXT NOT NULL,
        course_id TEXT ,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS texts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        lesson_id INTEGER,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        createdBy TEXT NOT NULL,
        comment TEXT NOT NULL,
        lesson_slug TEXT NOT NULL,
        FOREIGN KEY (lesson_slug) REFERENCES lessons(slug) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS courseCreateSteps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

  `);
};
