import useField from '../hooks/useField'
import { TextField, Button } from '@mui/material'
import { useCreateBlog } from '../hooks/useBlogs'
import { useNotificationActions } from '../hooks/useNotification'
import { useNavigate } from 'react-router-dom'
import { getApiErrorMessage } from '../utils/apiError'

const BlogForm = () => {
  const { inputProps: newTitle, reset: resetTitle } = useField('text')
  const { inputProps: newAuthor, reset: resetAuthor } = useField('text')
  const { inputProps: newUrl, reset: resetUrl } = useField('text')

  const createBlogMutation = useCreateBlog()
  const { showNotification } = useNotificationActions()
  const navigate = useNavigate()
  const addBlog = async (event) => {
    event.preventDefault()

    try {
      await createBlogMutation.mutateAsync({
        title: newTitle.value,
        author: newAuthor.value,
        url: newUrl.value,
      })

      showNotification({
        message: `${newTitle.value} has been created`,
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

    resetTitle()
    resetAuthor()
    resetUrl()
  }
  return (
    <div>
      <form onSubmit={addBlog}>
        <h2>Create New</h2>
        <div>
          <TextField
            {...newTitle}
            label="title:"
            placeholder="insert title here"
            variant="outlined"
            style={{ marginTop: 10 }}
          />
          <br />
          <TextField
            {...newAuthor}
            label="author:"
            variant="outlined"
            style={{ marginTop: 10 }}
          />
          <br />
          <TextField
            {...newUrl}
            label="url:"
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
