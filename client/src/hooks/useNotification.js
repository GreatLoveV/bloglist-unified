import { useContext } from 'react'
import NotificationContext from '../contexts/NotificationContext'

export const useNotificationValue = () => {
  const { notification } = useContext(NotificationContext)
  return notification
}

export const useNotificationActions = () => {
  const { showNotification, clearNotification } =
    useContext(NotificationContext)
  return { showNotification, clearNotification }
}
