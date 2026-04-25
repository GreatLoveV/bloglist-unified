import { useGetUsers } from '../hooks/useUsers'
import { Link, useMatch, Routes, Route } from 'react-router-dom'
import User from './User'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

import { Outlet } from 'react-router-dom'

const Users = () => {
  const result = useGetUsers()
  const users = result.data || []

  const match = useMatch('/users/:id')
  const matchedUser = match ? users.find((u) => u.id === match.params.id) : null
  if (result.isLoading) {
    return <div>Loading...</div>
  }

  const displayUsers = () => (
    <div>
      <Typography variant="h4" style={{ marginTop: 20, marginBottom: 20 }}>
        Users
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>{user.name}</Link>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

  return (
    <div>
      {match ? (
        <Routes>
          <Route path=":id" element={<User user={matchedUser} />} />
        </Routes>
      ) : (
        displayUsers()
      )}
    </div>
  )
}

export default Users
