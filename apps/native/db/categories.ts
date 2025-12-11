import { db } from "./database";

export interface Category {
    id: number;
    name: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
    return (await db).getAllAsync<Category>('SELECT * FROM categories');
};