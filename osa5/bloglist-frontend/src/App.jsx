import { useState, useEffect,  useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import Form from './components/Form'


const App = () => {

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  //5.3 kentät:
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  //5.4 notifikaatio:
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  //5.10 päivitys
  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        const sorted = initialBlogs.sort((a, b) => b.likes - a.likes)
        setBlogs(sorted)
      })
  }, [])

  useEffect(() => {
    const logged = window.localStorage.getItem('loggedBlogappUser')
    if (logged) {
      const user = JSON.parse(logged)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user)     )
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`${user.name} logged in successfully`)
      blogService.setToken(user.token)
    } catch (error) {
      showNotification('wrong username or password!')
      console.error('moka tapahtu loginis')}
  }

  //log outti:
  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    showNotification('You logged out')
    setUser(null)
  }
  //5.4 ilmotukset:
  const showNotification = (message) => {
    setNotification(message)
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  //tykkäykset:
  const addLikes = async (blog) => {
    console.log('blog.id        =', blog.id)
    console.log('blog.user.id   =', blog.user.id)
    console.log('käyttäjä token =', window.localStorage.getItem('loggedBlogappUser'))
    const updatedObject = {
      title:  blog.title,
      author: blog.author,
      url:    blog.url,
      user:   blog.user.id,
      likes:  blog.likes + 1
    }
    try {
      const returned = await blogService.update(blog.id, updatedObject)
      const merged = blogs.map(b => b.id !== blog.id ? b : { ...returned, user: blog.user })

      const sorted = merged.sort((a, b) => b.likes - a.likes)
      setBlogs(sorted)
    } catch (error) {
      console.error('like-klikkaus virhe', error)
    }
  }

  //5.3 blogin lisäys //tää muuttu 5.6
  const createBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const returned = await blogService.create(blogObject)
      const hmm = { ...returned, user }
      setBlogs(blogs.concat(hmm))
      showNotification(`a new blog "${returned.title}" by ${returned.author} added`)
    } catch {
      showNotification('creating blog failed')
    }
  }

  const removeBlog = async blog => {
    console.log('Poistotesti:', blog.id, 'käyttäjäjältä:', blog.user?.id, 'kuka kirjautunu:', user?.id)
    const poisto = window.confirm(
      `Poistetaan blogi: "${blog.title}", käyttäjältä: ${blog.author}?`
    )
    if (!poisto) return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch (error) {
      console.error('poistossa tapahtui moka', error)
    }
  }


  //jos käyttäjä ei ole vielä kirjautunut:
  if (user === null) {
    return (
      <div>
        {notification && <h2>{notification}</h2>}
        <h2>Log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            Käyttäjä:
            <input data-testid="username"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            Salasana:
            <input data-testid="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  //jos käyttäjä on kirjautunut:
  return (
    <div>
      {notification && <h2>{notification}</h2>}
      <h2>blogs</h2>
      <p>
        {user.name} logged in&nbsp;
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new" ref={blogFormRef}>
        <Form createBlog={createBlog} />
      </Togglable>

      {blogs.map(blog => <Blog key={blog.id} blog={blog} addLikes={addLikes} removeBlog={removeBlog}  currentUser={user}/>
      )}
    </div>
  )
}

export default App

