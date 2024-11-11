import { DB } from "./db";
export const createTables = (db: DB) => {
  db.exec(`

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    );
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        type TEXT NOT NULL,
        total_slots INTEGER NOT NULL,
        available_slots INTEGER NOT NULL,
        price INTEGER NOT NULL,
        created_by INTEGER,
        FOREIGN KEY (created_by) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL
    );

  `);
};