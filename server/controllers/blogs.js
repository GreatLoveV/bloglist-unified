const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (req, res) => {
  const fetchedBlogs = await Blog.find({})
    .populate('user', {
      username: 1,
      name: 1,
    })
    .populate('comments')
  res.json(fetchedBlogs)
})

blogsRouter.get('/:id', async (req, res) => {
  const fetchedBlog = await Blog.findById(req.params.id).populate('comments')
  res.json(fetchedBlog)
})

blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const body = req.body
  const user = req.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
    username: 1,
    name: 1,
  })
  res.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const user = req.user
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(204).end()
  }

  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } else {
    return res.status(401).json({ error: 'token invalid' })
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).end()
  }
  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const savedBlog = await blog.save()
  const updatedBlog = await Blog.findById(savedBlog._id)
    .populate('user', {
      username: 1,
      name: 1,
    })
    .populate('comments')
  res.status(200).json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (req, res) => {
  const { text } = req.body
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).end()
  }

  const comment = new Comment({
    text: text,
    blog: blog._id,
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  await blog.save()
  const populatedComment = await Comment.findById(savedComment._id).populate(
    'blog',
    { title: 1 },
  )
  res.status(201).json(populatedComment)
})
module.exports = blogsRouter
