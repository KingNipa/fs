const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { getTokenFrom } = require('../utils/middleware')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  console.log('*** POST /api/blogs body:', request.body)
  const body = request.body

  const token = getTokenFrom(request)
    const decodedToken = token
      ? jwt.verify(token, process.env.SECRET)
      : null

    if (!decodedToken || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return response.status(401).json({ error: 'user not found' })
    }



  if (!body.title) {
    console.log('Virhe: title puuttuu')
    return response.status(400).json({ error: 'title is missing' })
  }
  if (!body.url) {
    console.log('Virhe: url puuttuu')
    return response.status(400).json({ error: 'URL is missing' })
  }

  //Tätä ei enää tarvii
  /*
  const users = await User.find({})
  console.log('Käyttäjät:', users.map(u => u.username))
  if (users.length === 0) {
  console.log('Virhe: ei käyttäjiä')
  return response.status(400).json({ error: 'User not found' })
  }
  let userId = null
  if (users.length > 0) {
    userId = users[0]._id
  }

      if (!body.title) {
      return response.status(400).json({ error: 'title is missing' })
    }
    if (!body.url) {
      return response.status(400).json({ error: 'url is missing' })
    }
  const user = users[0] 
 */
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0, //t: 4.11 0 
    user: user._id
  })
  try {
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await Blog
    .findById(savedBlog._id)
    .populate('user', { username: 1, name: 1, id: 1 })

  response.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})
blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id
  try {
    const deleted = await Blog.findByIdAndDelete(id)
    if (deleted) {
      return response.status(204).end()
    } else { 
      return response.status(404).json({ error: 'blog not found' })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
