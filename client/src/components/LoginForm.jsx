import { TextField, Button } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  return (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          variant="standard"
          style={{ marginTop: 10 }}
        />
        <br />
        <TextField
          label="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          variant="standard"
          style={{ marginTop: 10 }}
        />
        <br />
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          {' '}
          login{' '}
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
