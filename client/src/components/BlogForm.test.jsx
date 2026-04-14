import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect } from 'vitest'
import BlogForm from './BlogForm'

test('the form calls the event handler it received as props with the right details when a new blog is created.', async () => {
  const createBlog = vi.fn()
  render(<BlogForm createBlog={createBlog} />)
  const titleBox = screen.getByPlaceholderText('insert title here')
  const sendButton = screen.getByText('Add')
  const user = userEvent.setup()
  await user.type(titleBox, 'title test')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title test')
})
