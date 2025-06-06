const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1, id: 1 })
    response.json(users)
  } catch (error) {
    next(error)
  }
})

//4.16 päivityksiä
usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({ error: 'username required' })
  }
  if (!password) {
    return response.status(400).json({ error: 'password required' })
  }

  if (username.length < 3) {
    return response.status(400).json({ error: 'username is too short' })
  }
  if (password.length < 3) {
    return response.status(400).json({ error: 'password is too short' })
  }

  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({ error: 'expected `username` to be unique' })
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

module.exports = usersRouter