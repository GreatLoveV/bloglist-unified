import {
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'

import { useParams, useOutletContext } from 'react-router-dom'

const User = () => {
  const { id } = useParams()
  const users = useOutletContext()
  const user = users.find((u) => u.id === id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <Typography variant="h4" style={{ marginTop: 20, marginBottom: 10 }}>
        {user.name}
      </Typography>
      <Typography variant="h6"> added blogs </Typography>
      {/* <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id}>
            <ListItemText primary={blog.title} secondary={blog.author} />
          </ListItem>
        ))}

        
      </List> */}
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User
