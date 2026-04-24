import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useCreateBlog } from '../hooks/useBlogs'
import { useNotificationActions } from '../hooks/useNotification'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../utils/apiError'

const BlogForm = () => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const createBlogMutation = useCreateBlog()
  const { showNotification } = useNotificationActions()
  const navigate = useNavigate()
  const addBlog = async (event) => {
    event.preventDefault()

    try {
      await createBlogMutation.mutateAsync({
        title: newTitle,
        author: newAuthor,
        url: newUrl,
      })

      showNotification({
        message: `${newTitle} has been created`,
        type: 'success',
      })

      navigate('/')
    } catch (exception) {
      console.error(exception)
      showNotification({
        message: getApiErrorMessage(exception, 'Failed to create blog'),
        type: 'error',
      })
    }

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <div>
      <form onSubmit={addBlog}>
        <h2>Create New</h2>
        <div>
          <TextField
            label="title:"
            type="text"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder="insert title here"
            variant="outlined"
            style={{ marginTop: 10 }}
          />
          <br />
          <TextField
            label="author:"
            type="text"
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            variant="outlined"
            style={{ marginTop: 10 }}
          />
          <br />
          <TextField
            label="url:"
            type="text"
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            variant="outlined"
            style={{ marginTop: 10 }}
          />
        </div>
        <Button type="submit" style={{ marginTop: 10 }} variant="contained">
          {' '}
          Add{' '}
        </Button>
      </form>
    </div>
  )
}

export default BlogForm
