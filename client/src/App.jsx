import { useState, useEffect } from 'react'
import { useNotificationActions } from './contexts/NotificationContext'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
  useMatch,
} from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
} from '@mui/material'
import Notification from './components/Notification'
import ErrorBoundary from './components/ErrorBoundary'
import Blog from './components/Blog'
import NotFound from './components/NotFound'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const { showNotification } = useNotificationActions()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification({
        message: `${blogObject.title} has been created`,
        type: 'success',
      })
      navigate('/')
    } catch (exception) {
      console.error(exception)
      showNotification({ message: 'Failed to create blog', type: 'error' })
    }
  }

  const deleteBlog = async (id) => {
    if (window.confirm('are you sure you want to delete this blog?')) {
      try {
        await blogService.remove(id)
        const newBlogs = blogs.filter((b) => b.id !== id)
        const deletedBlog = blogs.find((b) => b.id === id)
        setBlogs(newBlogs)
        showNotification({
          message: `${deletedBlog.title} has been deleted`,
          type: 'success',
        })
        navigate('/')
      } catch (exception) {
        console.error(exception)
        showNotification({ message: 'Failed to delete blog', type: 'error' })
      }
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      console.error('error occurred', exception)
      showNotification({ message: 'Wrong credentials', type: 'error' })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const likeIncrement = async (id, updatedBlog) => {
    const returnedBlog = await blogService.update(id, updatedBlog)
    setBlogs(blogs.map((blog) => (blog.id === id ? returnedBlog : blog)))
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const loginForm = () => (
    <LoginForm
      handleSubmit={handleLogin}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      username={username}
      password={password}
    />
  )

  const blogForm = () => <BlogForm createBlog={addBlog} />

  const navBar = () => (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blog App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        {user && (
          <Button color="inherit" component={Link} to="/create">
            create new
          </Button>
        )}
        {user ? (
          <Button color="inherit" onClick={handleLogout} component={Link}>
            logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  )

  const match = useMatch('/blogs/:id')
  const matchedBlog = match ? blogs.find((b) => b.id === match.params.id) : null

  return (
    <div>
      {navBar()}
      <h2>blog app</h2>
      <Notification />
      <ErrorBoundary>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : loginForm()}
          />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={matchedBlog}
                update={likeIncrement}
                remove={deleteBlog}
                user={user}
              />
            }
          />
          <Route
            path="/create"
            element={user ? blogForm() : <Navigate replace to="/login" />}
          />
          <Route
            path="/"
            element={
              <div>
                {sortedBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    style={{
                      paddingTop: 10,
                      paddingLeft: 2,
                      border: 'solid',
                      borderWidth: 1,
                      marginBottom: 5,
                    }}
                  >
                    <Link to={`/blogs/${blog.id}`}>
                      {blog.title} {blog.author}
                    </Link>
                  </div>
                ))}
              </div>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
