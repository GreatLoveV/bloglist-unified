import {
  Typography,
  Button,
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material'
import { useDeleteBlog, useUpdateBlog, useAddComment } from '../hooks/useBlogs'
import { useNotificationActions } from '../hooks/useNotification'
import { useNavigate } from 'react-router-dom'
import useField from '../hooks/useField'

const Blog = ({ blog, user }) => {
  const updateBlogMutation = useUpdateBlog()
  const addCommentMutation = useAddComment()
  const { showNotification } = useNotificationActions()
  const deleteBlogMutation = useDeleteBlog()
  const navigate = useNavigate()
  const commentField = useField('text')

  if (!blog) return null

  const incrementLike = async () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      await updateBlogMutation.mutateAsync({ id: blog.id, updatedBlog })
    } catch (error) {
      console.error('Failed to update blog', error)
      showNotification({ message: 'Failed to update blog', type: 'error' })
    }
  }

  const deleteBlog = async (id) => {
    if (window.confirm('are you sure you want to delete this blog?')) {
      try {
        await deleteBlogMutation.mutateAsync(id)
        showNotification({
          message: `${blog.title} has been deleted`,
          type: 'success',
        })
        navigate('/')
      } catch (exception) {
        console.error(exception)
        showNotification({ message: 'Failed to delete blog', type: 'error' })
      }
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    const text = commentField.inputProps.value
    if (!text) return

    try {
      await addCommentMutation.mutateAsync({ id: blog.id, text })
      commentField.reset()
      showNotification({ message: 'Comment added', type: 'success' })
    } catch (error) {
      console.error('Failed to add comment', error)
      showNotification({ message: 'Failed to add comment', type: 'error' })
    }
  }

  return (
    <Box sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h3" gutterBottom>
          {blog.title}
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          by {blog.author}
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography
            component="a"
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'primary.main',
              textDecoration: 'underline',
              display: 'block',
              mb: 1,
            }}
          >
            {blog.url}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            added by {blog.user ? blog.user.username : 'unknown'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography variant="body1">
            <strong>{blog.likes}</strong> likes
          </Typography>
          {user && (
            <Button
              variant="contained"
              color="primary"
              onClick={incrementLike}
              size="small"
            >
              Like
            </Button>
          )}
          {user && blog.user && user.username === blog.user.username && (
            <Button
              variant="outlined"
              onClick={() => deleteBlog(blog.id)}
              color="error"
              size="small"
            >
              Remove
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            Comments
          </Typography>

          <Box
            component="form"
            onSubmit={handleAddComment}
            sx={{ display: 'flex', gap: 1, mb: 3 }}
          >
            <TextField
              {...commentField.inputProps}
              label="add a comment"
              size="small"
              fullWidth
            />
            <Button variant="contained" type="submit">
              add comment
            </Button>
          </Box>

          {blog.comments && blog.comments.length > 0 ? (
            <List dense>
              {blog.comments.map((c) => (
                <ListItem key={c.id} divider>
                  <ListItemText primary={c.text} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary">
              no comments yet
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default Blog
