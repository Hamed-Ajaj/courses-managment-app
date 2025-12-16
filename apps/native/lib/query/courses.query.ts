import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory, createCourse, removeCourse } from "../api/courses.api"

export const useAddCourse = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['courses'],
            })
        }
    })
}


export const useDeleteCourse = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: removeCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['courses'],
            });
            queryClient.invalidateQueries({
                queryKey: ['categories'],
            });
            queryClient.invalidateQueries({
                queryKey: ['category']
            })
        }
    })
}

export const useAddCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['categories'],
            })
        }
    })
}
