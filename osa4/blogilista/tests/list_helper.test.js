const {test, describe} = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.allLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

   const listWithManyBlogs = [
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Yoda',
      author: 'Nipa Skywalker',
      url: 'https://starwars.com/',
      likes: 55,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17c3',
      title: 'Marvel',
      author: 'Nipa Marvelsson',
      url: 'https://marvel.fi/',
      likes: 10,
      __v: 0
    }
  ]

    test('of a bigger list is calculated right', () => {
    const result = listHelper.allLikes(listWithManyBlogs)
    assert.strictEqual(result, 65)
  })

  test('of empty list is zero', () => {
    const result = listHelper.allLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog returns that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    assert.deepStrictEqual(result, listWithOneBlog[0])
  })

  const listWithManyBlogs = [
    {
      _id: '5a422aa71b54a676234d17f9',
      title: 'Yoda',
      author: 'Nipa Skywalker',
      url: 'https://starwars.com/',
      likes: 55,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17c3',
      title: 'Marvel',
      author: 'Nipa Marvelsson',
      url: 'https://marvel.fi/',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17a1',
      title: 'DC',
      author: 'Joker',
      url: 'https://dcjokeri.fi',
      likes: 100,
      __v: 0
    }
  ]

  test('of a bigger list returns one with most likes', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    const possibleFavorites = [
      listWithManyBlogs[0],
      listWithManyBlogs[2]
    ]
    const matches = possibleFavorites.filter(b =>
      b._id === result._id &&
      b.title === result.title &&
      b.author === result.author &&
      b.url === result.url &&
      b.likes === result.likes
    )
    assert.strictEqual(matches.length > 0, true)
  })

  test('empty list', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })
})



