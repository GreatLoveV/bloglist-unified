const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialUsers = async () => {
  const passwordHash1 = await bcrypt.hash('password123', 10)
  const passwordHash2 = await bcrypt.hash('securePass456', 10)

  return [
    {
      username: 'wael',
      name: 'Wael tazi',
      passwordHash: passwordHash1,
      blogs: []
    },
    {
      username: 'admin',
      name: 'Admin User',
      passwordHash: passwordHash2,
      blogs: []
    }
  ]
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = { usersInDb, initialUsers }