const { test, after, beforeEach } = require('node:test')
const supertest = require('supertest')
const assert = require('node:assert')
const blogHelper = require('../utils/blog_api_helper.js')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const app = require('../app')

const api = supertest(app)
let token = null

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const user = new User({ username: 'root', passwordHash: 'hashedpassword' })
  await user.save()

  const userForToken = { username: 'root', id: user._id }
  token = jwt.sign(userForToken, process.env.SECRET)

  const blogsWithUser = blogHelper.initialBlogs.map(blog => ({ ...blog, user: user._id }))
  await Blog.insertMany(blogsWithUser)
})

test('Blogs are returned as JSON', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  assert.strictEqual(response.body.length, blogHelper.initialBlogs.length)
})

test('Blogs unique identifier is named id', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach(blog => {
    assert(blog.id)
  })
})

test('Blog gets posted successfully', async () => {
  const blogToBeAdded = {
    _id: '5a422bb81c24a676234d18a1',
    title: 'Reflections on Trusting Trust',
    author: 'Ken Thompson',
    url: 'https://dl.acm.org/doi/10.1145/358198.358210',
    likes: 12,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToBeAdded)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogs = await blogHelper.blogsInDb()
  assert.strictEqual(blogs.length, blogHelper.initialBlogs.length + 1)
  const addedNote = blogs.find(blog => blog.title === blogToBeAdded.title)

  assert.strictEqual(addedNote.author , blogToBeAdded.author)
  assert.strictEqual(addedNote.url , blogToBeAdded.url)
  assert.strictEqual(addedNote.likes , blogToBeAdded.likes)
})


test('missing likes property defaults to zero', async () => {
  const blogToBeAdded = {
    _id: '5a422bb81c24a676234d18a1',
    title: 'Reflections on Trusting Trust',
    author: 'Ken Thompson',
    url: 'https://dl.acm.org/doi/10.1145/358198.358210',
    __v: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToBeAdded)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await blogHelper.blogsInDb()
  const addedNote = blogs.find(blog => blog.title === blogToBeAdded.title)

  assert.strictEqual(addedNote.likes, 0)
})

test('400 backend response to missing title or url ', async () => {
  const blogToBeAdded = {
    _id: '5a422bb81c24a676234d18a1',
    author: 'Ken Thompson',
    likes: 12,
    __v: 0
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogToBeAdded)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

test('deletion succeeds with status of 204 if id is valid', async () => {
  const blogsAtStart = await blogHelper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await blogHelper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)

  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, blogHelper.initialBlogs.length - 1 )
})

test('succeeds with updating a blog with a valid id', async () => {
  const blogsAtStart = await blogHelper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    title: 'Advanced React Patterns',
    author: 'Michael Chan',
    url: 'https://advancedreactpatterns.dev/',
    likes: 42
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 42)
  assert.strictEqual(response.body.title, updatedData.title)

  const blogsAtEnd = await blogHelper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, 42)
})

test('adding a blog fails with proper status code 401 unauthorized if a token is not provided', async () => {
  const blogToBeAdded = {
    _id: '5a422bb81c24a676234d18a1',
    title: 'Reflections on Trusting Trust',
    author: 'Ken Thompson',
    url: 'https://dl.acm.org/doi/10.1145/358198.358210',
    likes: 12,
    __v: 0
  }

  const result = await api
    .post('/api/blogs')
    .send(blogToBeAdded)
    .expect(401)
    .expect('Content-Type', /application\/json/)

  assert(result.body.error.includes('token invalid'))

  const blogs = await blogHelper.blogsInDb()
  assert.strictEqual(blogs.length, blogHelper.initialBlogs.length)
})
after(async () => {
  await mongoose.connection.close()
})