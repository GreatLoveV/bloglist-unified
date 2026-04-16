import { create } from 'zustand'
import blogService from '../services/blogs'

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    setBlogs: (expression) => set(() => ({ expression })),
    initialize: async () => {
      const blogs = await blogService.getAll()
      set(() => ({ blogs }))
    },
    createBlog: async (newBlog) => {
      const savedBlog = await blogService.create(newBlog)
      set((state) => ({
        blogs: state.blogs.concat(savedBlog),
      }))
    },
  },
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
