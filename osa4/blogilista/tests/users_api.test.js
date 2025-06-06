
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', { concurrent: false }, () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('salainen', 10)
    const user = new User({ username: 'Nipa', name: 'Nipazu', passwordHash})
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ekanipa',
      name: 'ekaaaaaaa',
      password: 'salainen'
    }
    await api.post('/api/users').send(newUser).expect(201).expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert.ok(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Nipa',
      name: 'Nipazu',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.ok(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'N',
      name: 'Ni',
      password: 'salis'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, 1)
  })

    test('creation fails if password too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testiiiiiiii',
      name: 'Nipazuikka',
      password: 'sa',
    }

    await api.post('/api/users').send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('all users are returned as json', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const users = response.body
    assert.strictEqual(users.length, 1)
    assert.strictEqual(users[0].username, 'Nipa')
    assert.ok(Array.isArray(users[0].blogs), '[0].blogs ei oo taulukko')
  })
})

after(async () => {
  await mongoose.connection.close()
})