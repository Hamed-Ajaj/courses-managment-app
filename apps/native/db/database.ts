
// db/database.ts
import * as SQLite from 'expo-sqlite';

export const db = SQLite.openDatabaseAsync('courses.db');

// Initialize DB tables
export const initDb = async () => {

  // TODO: add tags table and course_tags table
  await (await db).execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      color TEXT DEFAULT '#3b82f6', -- blue default
      icon TEXT DEFAULT 'grid'
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      link TEXT,
      description TEXT,
      status TEXT DEFAULT 'not-started',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Many-to-many relationship
    CREATE TABLE IF NOT EXISTS course_categories (
      course_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE CASCADE,
      UNIQUE (course_id, category_id)
    );
  `);

  // Migration for existing tables
  try {
    await (await db).execAsync("ALTER TABLE categories ADD COLUMN icon TEXT DEFAULT 'grid'");
  } catch (e) {
    // Column likely already exists
  }

  console.log("✅ Database initialized");
};
