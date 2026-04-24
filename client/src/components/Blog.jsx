import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material'
import { useDeleteBlog, useUpdateBlog } from '../hooks/useBlogs'
import { useNotificationActions } from '../hooks/useNotification'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, user }) => {
  const updateBlogMutation = useUpdateBlog()
  const { showNotification } = useNotificationActions()
  const deleteBlogMutation = useDeleteBlog()
  const navigate = useNavigate()

  if (!blog) return null

  // const blogStyle = {
  //   paddingTop: 10,
  //   paddingLeft: 2,
  //   border: 'solid',
  //   borderWidth: 1,
  //   marginBottom: 5,
  // }

  const IncrementLike = async (id) => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    try {
      await updateBlogMutation.mutateAsync({ id, updatedBlog })
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

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {blog.author}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'primary.main',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {blog.url}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          added by {blog.user ? blog.user.username : 'unknown'}
        </Typography>
      </CardContent>
      <CardActions sx={{ gap: 1 }}>
        {blog.likes} likes
        {user && (
          <Button
            variant="outlined"
            color="primary"
            onClick={IncrementLike}
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
      </CardActions>
    </Card>
  )
}

export default Blog
