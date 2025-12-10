
// db/reset.ts
import { db } from './database';

export const deleteAll = async () => {
  const database = await db;

  await database.execAsync(`
    DELETE FROM course_categories;
    DELETE FROM courses;
    DELETE FROM categories;
    VACUUM;
  `);

  console.log("🗑️ All data deleted (tables preserved)");
};
