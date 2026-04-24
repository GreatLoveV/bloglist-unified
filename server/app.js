require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const { info, error } = require('./utils/logger')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const morgan = require('morgan')

const app = express()
info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    info('connected to MongoDb')
  })
  .catch((err) => {
    error('error connecting to MongoDb:', err.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)
app.use(morgan('tiny'))
app.use(middleware.allowCrossOrigin)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test'){
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}


if (process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../client/dist')))

  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'))
  })
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
