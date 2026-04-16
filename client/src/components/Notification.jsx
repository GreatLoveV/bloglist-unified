import { Alert } from '@mui/material'
import { useNotification } from '../stores/notificationStore'

const Notification = () => {
  const message = useNotification()
  if (!message || message.message === null) {
    return null
  }

  return (
    <Alert style={{ marginBottom: 10 }} severity={message.type}>
      {message.message}
    </Alert>
  )
}

export default Notification
