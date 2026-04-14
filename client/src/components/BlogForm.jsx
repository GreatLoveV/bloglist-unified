import { useState } from 'react'
import { TextField, Button } from '@mui/material'
const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
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
