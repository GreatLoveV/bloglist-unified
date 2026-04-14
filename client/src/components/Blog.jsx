import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material'
const Blog = ({ blog, update, remove, user }) => {
  if (!blog) return null

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const IncrementLike = () => {
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    update(blog.id, updatedBlog)
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
          added by {blog.user.username}
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
            onClick={() => remove(blog.id)}
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
