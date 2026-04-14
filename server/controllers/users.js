const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')



usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  const saltRounds = 10
  if (!password || password.length < 3){
    return res.status(401).json({ error: 'password must be at least 3 characters long' })
  }
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)

})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { likes: 0, user: 0 })
  res.status(200).json(users)
})

module.exports = usersRouter