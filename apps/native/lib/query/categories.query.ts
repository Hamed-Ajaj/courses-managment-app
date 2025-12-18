import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createCategory, removeCategory } from "../api/categories.api"

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

export const useDeleteCategory = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: removeCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['categories'],
            })
        }
    })
}