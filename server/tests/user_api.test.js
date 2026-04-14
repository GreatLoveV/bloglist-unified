const { beforeEach, test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const userHelper = require('../utils/user_api_helper')
const mongoose = require('mongoose')
const User = require('../models/user')
const app = require('../app')


const api = supertest(app)


describe('when there is initially some users saved', () => {
  beforeEach(async() => {
    await User.deleteMany({})
    await User.insertMany(await userHelper.initialUsers())
  })

  describe('creating a new user', () => {
    test.only('invalid users are not created and corresponsing status code and error message are sent back', async () => {
      const usersAtStart = await userHelper.usersInDb()
      const userToAdd = {
        username: 'wa',
        name: 'wael',
        passwordHash: 'wa',
      }
      const response = await api
        .post('/api/users')
        .send(userToAdd)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await userHelper.usersInDb()
      assert.strictEqual(usersAtStart.length, usersAtEnd.length)
      assert(response.body.error.includes('password'))
    })
  })

})


after(async() => {
  await mongoose.connection.close()
})
