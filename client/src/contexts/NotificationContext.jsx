import { createContext, useReducer, useRef } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return {
        message: action.payload.message,
        type: action.payload.type,
      }
    case 'CLEAR':
      return {
        message: null,
        type: null,
      }
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, {
    message: null,
    type: null,
  })

  const timeoutRef = useRef(null)

  const showNotification = ({ message, type = 'success' }, seconds = 5) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    dispatch({
      type: 'SHOW',
      payload: { message, type },
    })

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, seconds * 1000)
  }

  const clearNotification = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    dispatch({ type: 'CLEAR' })
  }

  return (
    <NotificationContext.Provider
      value={{ notification, showNotification, clearNotification }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
