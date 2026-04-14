import { render, screen } from '@testing-library/react'
import Blog from './Blog'
// import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'

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

test('Authenticated users who are not the blog’s creator are shown only the like button', () => {
  const user = { username: 'other_user' }
  render(<Blog blog={blog} user={user} />)

  const likeButton = screen.getByRole('button', { name: /like/i })
  const removeButton = screen.queryByRole('button', { name: /remove/i })

  expect(likeButton).toBeInTheDocument()
  expect(removeButton).toBeNull()
})

test('The blog’s creator is also shown the delete button', () => {
  const user = { username: 'wael' }
  render(<Blog blog={blog} user={user} />)

  const likeButton = screen.getByRole('button', { name: /like/i })
  const removeButton = screen.getByRole('button', { name: /remove/i })

  expect(likeButton).toBeInTheDocument()
  expect(removeButton).toBeInTheDocument()
})
