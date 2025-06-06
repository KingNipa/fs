const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')  
const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user') 
const helper = require('./test_helper')
const api = supertest(app)

describe('when there are initially some blogs saved', { concurrent: false }, () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})


    const passwordHash = await bcrypt.hash('salainen', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    const savedUser = await user.save()

  const blogsToInsert = helper.initialBlogs.map(blog => ({
      ...blog, user: savedUser._id }))
    await Blog.insertMany(blogsToInsert)
  })

  test('notes are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })


test('blogs have id field', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body

    blogs.forEach(blog => {
      assert.ok(blog.id, 'blogs must have id field. NO _id')
      assert.strictEqual(blog._id, undefined)
    })
  })

    //4.10
   test('it is possible to add blogs and number of blogs increased by 1!', async () => {
    const newBlog = {
      title: 'Batman',
      author: 'Writer',
      url: 'www.batmanbest.fi',
      likes: 100
    }
    const response = await api.post('/api/blogs').send(newBlog)
   .expect(201).expect('Content-Type', /application\/json/)
    assert.ok(response.body.user, 'user-kenttä puuttuu')
    assert.ok(response.body.user.username, 'user.username puuttuu')

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Batman'))
  })
  test('if there is no likes then it is automatically 0 ', async () => {
    const newBlog = {
      title: 'Kovisblogi',
      author: 'k5',
      url: 'www.kovikset.fi'
    }
    const response = await api.post('/api/blogs')
    .send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
    assert.ok(response.body.user, 'user-kenttä puuttuu')
    assert.ok(response.body.user.username, 'user.username puuttuu')
    assert.strictEqual(response.body.likes, 0)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('Kovisblogi'))
  })
test('blog must have a title', async () => {
    const newBlog = {
      author: 'Vitsiniekka',
      url: 'www.vitsiniekat.com',
      likes: 105
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('blog must have an URL', async () => {
    const newBlog = {
      title: 'Test',
      author: 'Testman',
      likes: 500
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
 
   describe('delete blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const titles = blogsAtEnd.map((b) => b.title)

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
      assert.ok(!titles.includes(blogToDelete.title))
    })
    })
    })

after(async () => {
  await mongoose.connection.close()
})
