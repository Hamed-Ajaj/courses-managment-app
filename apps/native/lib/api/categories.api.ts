import { addCategory, deleteCategory } from "@/db/categories"


export const createCategory = async (categoryData: { name: string, color: string, icon: string }) => {
    try {
        const newCategory = await addCategory(categoryData.name, categoryData.color, categoryData.icon)
        return newCategory
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to add category', error)
        }
        throw new Error('Unknown error')
    }
}

export const removeCategory = async (id: number) => {
    try {
        const deletedCategory = await deleteCategory(id)
        return deletedCategory
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to delete category', error)
        }
        throw new Error('Unknown error')
    }
}