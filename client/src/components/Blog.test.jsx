import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'
import Blog from './Blog'

const mocks = vi.hoisted(() => ({
  updateMutateAsync: vi.fn(),
  deleteMutateAsync: vi.fn(),
  showNotification: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('../hooks/useBlogs', () => ({
  useUpdateBlog: () => ({ mutateAsync: mocks.updateMutateAsync }),
  useDeleteBlog: () => ({ mutateAsync: mocks.deleteMutateAsync }),
}))

vi.mock('../hooks/useNotification', () => ({
  useNotificationActions: () => ({ showNotification: mocks.showNotification }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  }
})

const blog = {
  id: '1',
  title: 'Wael 2% body fat',
  author: 'Wael',
  url: 'https://wael.com',
  likes: 5,
  user: {
    username: 'wael',
    name: 'wael ettazi',
  },
}

beforeEach(() => {
  vi.clearAllMocks()
})

test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {
  render(<Blog blog={blog} />)

  expect(screen.getByText('Wael 2% body fat')).toBeInTheDocument()
  expect(screen.getByText('Wael')).toBeInTheDocument()
  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(/5 likes/)).toBeInTheDocument()

  const likeButton = screen.queryByRole('button', { name: /like/i })
  const removeButton = screen.queryByRole('button', { name: /remove/i })

  expect(likeButton).toBeNull()
  expect(removeButton).toBeNull()
})

test('Authenticated users who are not the blog creator are shown only the like button', () => {
  const user = { username: 'other_user' }
  render(<Blog blog={blog} user={user} />)

  const likeButton = screen.getByRole('button', { name: /like/i })
  const removeButton = screen.queryByRole('button', { name: /remove/i })

  expect(likeButton).toBeInTheDocument()
  expect(removeButton).toBeNull()
})

test('The blog creator is also shown the delete button', () => {
  const user = { username: 'wael' }
  render(<Blog blog={blog} user={user} />)

  const likeButton = screen.getByRole('button', { name: /like/i })
  const removeButton = screen.getByRole('button', { name: /remove/i })

  expect(likeButton).toBeInTheDocument()
  expect(removeButton).toBeInTheDocument()
})

test('Clicking like updates the current blog by id with an incremented like count', async () => {
  mocks.updateMutateAsync.mockResolvedValueOnce({ ...blog, likes: 6 })

  render(<Blog blog={blog} user={{ username: 'other_user' }} />)

  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: /like/i }))

  expect(mocks.updateMutateAsync).toHaveBeenCalledWith({
    id: blog.id,
    updatedBlog: expect.objectContaining({
      id: blog.id,
      likes: blog.likes + 1,
    }),
  })
})
