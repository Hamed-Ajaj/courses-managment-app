import { addCategory, Category, getAllCategories } from "@/db/categories";
import { getAllCourses, addCourse, CourseStatus, deleteCourse, addCategoryCourse, deleteCategoryCourse, getCoursesByCategory } from "@/db/courses"

export interface AddCourse {
    title: string;
    description: string;
    link: string;
    status: CourseStatus;
    category?: number;
}

export const fetchCourses = async () => {
    try {
        const courses = await getAllCourses()
        return courses
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to fetch courses', error)
        }
        throw new Error('Unknown error')
    }
}

export const fetchCategories = async () => {
    try {
        const categories = await getAllCategories()
        return categories
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to fetch categories', error)
        }
        throw new Error('Unknown error')
    }
}

export const fetchCoursesByCategory = async (categoryId: number) => {
    try {
        const courses = await getCoursesByCategory(categoryId)
        return courses
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to fetch courses by category', error)
        }
        throw new Error('Unknown error')
    }
}

export const createCourse = async (courseData: AddCourse) => {
    try {
        const newCourse = await addCourse(courseData.title, courseData.link, courseData.description, courseData.status)
        if (courseData.category) {
            await addCategoryCourse(newCourse, courseData.category)
        }
        return newCourse
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to add course', error)
        }
        throw new Error('Unknown error')
    }
}


// export const createCategoryCourse = async (courseId: number, categoryId: number) => {
//     try {
//         const newCategoryCourse = await addCategoryCourse(courseId, categoryId)
//         return newCategoryCourse
//     } catch (error) {
//         if (error instanceof Error) {
//             throw new Error('Failed to add category course', error)
//         }
//         throw new Error('Unknown error')
//     }
// }

export const removeCourse = async (id: number) => {
    try {
        const deletedCourse = await deleteCourse(id)
        return deletedCourse
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to delete course', error)
        }
        throw new Error('Unknown error')
    }
}



export const removeCategoryCourse = async (courseId: number, categoryId: number) => {
    try {
        const deletedCategoryCourse = await deleteCategoryCourse(courseId, categoryId)
        return deletedCategoryCourse
    } catch (error) {
        if (error instanceof Error) {
            throw new Error('Failed to delete category course', error)
        }
        throw new Error('Unknown error')
    }
}