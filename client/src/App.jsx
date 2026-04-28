import { useState } from 'react'
import { useNotificationActions } from './hooks/useNotification'
import { useUserActions, useUserValue } from './hooks/useUser'
import { useGetBlogs } from './hooks/useBlogs'
import { useGetUsers } from './hooks/useUsers'
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
import BlogList from './components/BlogList'
import Users from './components/Users'
import User from './components/User'
import NotFound from './components/NotFound'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const user = useUserValue()
  const resultBlogs = useGetBlogs()
  const blogs = resultBlogs.data || []
  const resultUsers = useGetUsers()
  const users = resultUsers.data || []
  const navigate = useNavigate()
  const { showNotification } = useNotificationActions()
  const { login, logout } = useUserActions()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      login(username, password)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      console.error('error occurred', exception)
      showNotification({ message: 'Wrong credentials', type: 'error' })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
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

  const blogForm = () => <BlogForm />

  const navBar = () => (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Blog App
        </Typography>
        <Button color="inherit" component={Link} to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
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

  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch
    ? blogs.find((b) => b.id === blogMatch.params.id)
    : null
  const userMatch = useMatch('/users/:id')
  const matchedUser = userMatch
    ? users.find((b) => b.id === userMatch.params.id)
    : null

  return (
    <div>
      {navBar()}
      <Notification />
      <ErrorBoundary>
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate replace to="/" /> : loginForm()}
          />
          <Route
            path="/blogs/:id"
            element={<Blog blog={matchedBlog} user={user} />}
          />
          <Route
            path="/create"
            element={user ? blogForm() : <Navigate replace to="/login" />}
          />
          <Route path="/" element={<BlogList blogs={sortedBlogs} />} />
          <Route path="/users/" element={<Users users={users} />} />
          <Route path="/users/:id" element={<User user={matchedUser} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
