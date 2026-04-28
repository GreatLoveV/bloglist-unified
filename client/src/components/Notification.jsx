import { Alert } from '@mui/material'
import { useNotificationValue } from '../hooks/useNotification'

const Notification = () => {
  const notification = useNotificationValue()
  if (!notification || notification.message === null) {
    return null
  }

  return (
    <Alert
      style={{ marginBottom: 10, marginTop: 20 }}
      severity={notification.type}
    >
      {notification.message}
    </Alert>
  )
}

export default Notification
