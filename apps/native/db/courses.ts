
// db/courses.ts
import { db } from './database';

export type CourseStatus = 'not-started' | 'in-progress' | 'completed';

export interface Course {
  id: number;
  title: string;
  link?: string;
  description?: string;
  status: CourseStatus;
  created_at: string;
}

export const getAllCourses = async (): Promise<Course[]> => {
  return (await db).getAllAsync<Course>('SELECT * FROM courses ORDER BY created_at DESC');
};

export const getCourseById = async (id: number): Promise<Course | null> => {
  return (await db).getFirstAsync<Course>('SELECT * FROM courses WHERE id = ?', [id]);
};

export const addCourse = async (
  title: string,
  link?: string,
  description?: string,
  status: CourseStatus = 'not-started'
): Promise<number> => {
  const result = (await db).runAsync(
    'INSERT INTO courses (title, link, description, status) VALUES (?, ?, ?, ?)',
    [title, link || null, description || null, status]
  );
  return (await result).lastInsertRowId!;
};

export const addCategoryCourse = async (courseId: number, categoryId: number) => {
  const result = (await db).runAsync(
    'INSERT INTO course_categories (course_id, category_id) VALUES (?, ?)',
    [courseId, categoryId]
  );
}

export const updateCourseStatus = async (id: number, status: CourseStatus) => {
  (await db).runAsync('UPDATE courses SET status = ? WHERE id = ?', [status, id]);
};

export const deleteCourse = async (id: number) => {
  (await db).runAsync('DELETE FROM courses WHERE id = ?', [id]);
};

export const getCoursesByCategory = async (categoryId: number): Promise<Course[]> => {
  return (await db).getAllAsync<Course>(
    `SELECT courses.* FROM courses 
     JOIN course_categories ON courses.id = course_categories.course_id 
     WHERE course_categories.category_id = ?
     ORDER BY courses.created_at DESC`,
    [categoryId]
  );
};
