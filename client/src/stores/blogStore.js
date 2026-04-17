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
    updateBlog: async (id, changedBlog) => {
      let previousBlogs
      set((state) => {
        previousBlogs = state.blogs
        return {
          blogs: state.blogs.map((b) => (b.id === id ? changedBlog : b)),
        }
      })
      try {
        const updatedBlog = await blogService.update(id, changedBlog)
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === id ? updatedBlog : b)),
        }))
      } catch (error) {
        set(() => ({
          blogs: previousBlogs,
        }))
        throw error
      }
    },
    removeBlog: async (id) => {
      await blogService.remove(id)
      set((state) => ({
        blogs: state.blogs.filter((b) => b.id !== id),
      }))
    },
  },
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
