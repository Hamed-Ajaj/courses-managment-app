
// db/seedDb.ts
import { db } from "./database";

export const seedDb = async () => {
  const database = await db;

  console.log("🌱 Seeding database...");

  await database.execAsync(`
    INSERT INTO categories (name, color)
    VALUES
      ('Backend', '#3b82f6'),
      ('Frontend', '#10b981'),
      ('Low Level', '#f97316'),
      ('Self Hosting', '#8b5cf6');

    INSERT INTO courses (title, link, description, status)
    VALUES
      ('Learn Node.js', 'https://udemy.com/course/nodejs', 'Full Node course', 'not-started'),
      ('React Native Crash Course', 'https://youtube.com/playlist?react-native', 'Quick intro', 'in-progress'),
      ('Operating Systems Basics', NULL, 'Low level core concepts', 'not-started'),
      ('Self Hosting Essentials', 'https://youtube.com/self-hosting', 'Host own services', 'completed');

    INSERT INTO course_categories (course_id, category_id)
    VALUES
      (1, 1), -- Node.js -> Backend
      (2, 2), -- RN -> Frontend
      (3, 3), -- OS Basics -> Low Level
      (4, 4); -- Self Hosting -> Self Hosting
  `);

  console.log("✅ Seed completed!");
};
