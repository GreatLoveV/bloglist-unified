import { Alert } from '@mui/material'

const Notification = ({ message }) => {
  if (!message || message.message === null) {
    return null
  }

  return (
    <Alert
      style={{ marginBottom: 10, marginBottom: 10 }}
      severity={message.type}
    >
      {message.message}
    </Alert>
  )
}

export default Notification
