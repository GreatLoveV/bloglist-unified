const User = require('../models/user')
const jwt = require('jsonwebtoken')


const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  if (error.name === 'CastError'){
    return res.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError'){
    const firstError = Object.values(error.errors)[0].message
    return res.status(400).json({ error: firstError })
  }else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
    return res.status(400).json({ error: 'expected `username` to be unique' })
  }else if (error.name === 'JsonWebTokenError'){
    return res.status(401).json({ error: 'token invalid' })
  }else if (error.name === 'TokenExpiredError'){
    return res.status(401).json({ error: 'token expired' })
  }
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (req, res, next) => {
  console.log('Method: ', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---', )
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    req.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (req, res, next) => {
  const decodedToken = jwt.verify(req.token, process.env.SECRET)
  if (!decodedToken.id){
    return res.status(401).json({ error: 'token invalid' })
  }
  req.user = await User.findById(decodedToken.id)
  if (!req.user){
    return res.status(400).json({ error: 'userId missing or not valid' })
  }
  next()
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  requestLogger,
  tokenExtractor,
  userExtractor
}