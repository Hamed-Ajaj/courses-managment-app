import { db } from "./database";

export interface Category {
    id: number;
    name: string;
    color: string;
    icon: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
    return (await db).getAllAsync<Category>('SELECT * FROM categories');
};

export const addCategory = async (name: string, color: string, icon: string) => {
    return (await db).runAsync('INSERT INTO categories (name, color, icon) VALUES (?, ?, ?)', name, color, icon);
};

export const deleteCategory = async (id: number) => {
    return (await db).runAsync('DELETE FROM categories WHERE id = ?', id);
};
