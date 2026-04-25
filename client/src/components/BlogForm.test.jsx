import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

const mocks = vi.hoisted(() => ({
  createMutateAsync: vi.fn(),
  showNotification: vi.fn(),
  navigate: vi.fn(),
}))

vi.mock('../hooks/useBlogs', () => ({
  useCreateBlog: () => ({ mutateAsync: mocks.createMutateAsync }),
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

beforeEach(() => {
  vi.clearAllMocks()
})

test('submitting the form sends the new blog details to the create mutation', async () => {
  mocks.createMutateAsync.mockResolvedValueOnce({
    id: '1',
    title: 'title test',
    author: 'author test',
    url: 'https://example.com',
  })

  render(<BlogForm />)

  const user = userEvent.setup()

  await user.type(screen.getByPlaceholderText('insert title here'), 'title test')
  await user.type(screen.getByLabelText(/author/i), 'author test')
  await user.type(screen.getByLabelText(/url/i), 'https://example.com')
  await user.click(screen.getByRole('button', { name: /add/i }))

  expect(mocks.createMutateAsync).toHaveBeenCalledWith({
    title: 'title test',
    author: 'author test',
    url: 'https://example.com',
  })
})
