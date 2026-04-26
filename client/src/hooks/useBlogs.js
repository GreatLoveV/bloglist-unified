import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'

export const useGetBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}

export const useUpdateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, updatedBlog }) => blogService.update(id, updatedBlog),
    onSuccess: (updatedBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      if (blogs) {
        const updatedBlogs = blogs.map((b) =>
          b.id === updatedBlog.id ? updatedBlog : b
        )
        queryClient.setQueryData(['blogs'], updatedBlogs)
      }
    },
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, deletedId) => {
      const blogs = queryClient.getQueryData(['blogs'])
      if (blogs) {
        queryClient.setQueryData(
          ['blogs'],
          blogs.filter((b) => b.id !== deletedId),
        )
      }
    },
  })
}

export const useAddComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, text }) => blogService.addComment(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })
}
