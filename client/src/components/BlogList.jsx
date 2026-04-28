import { Box, Typography, Container, Link as MuiLink } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

const BlogList = ({ blogs }) => {
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Blogs
      </Typography>

      {blogs.map((blog) => (
        <Box
          key={blog.id}
          sx={{
            mb: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            transition: '0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              boxShadow: 2,
            },
          }}
        >
          <MuiLink
            component={RouterLink}
            to={`/blogs/${blog.id}`}
            underline="none"
            sx={{
              display: 'block',
              p: 2,
              color: 'text.primary',
            }}
          >
            <Typography variant="h6" component="span">
              {blog.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              by {blog.author}
            </Typography>
          </MuiLink>
        </Box>
      ))}
    </Container>
  )
}

export default BlogList
