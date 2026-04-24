import { useContext } from 'react'
import UserContext from '../contexts/UserContext'

export const useUserValue = () => {
  const { user } = useContext(UserContext)
  return user
}

export const useUserActions = () => {
  const { login, logout } = useContext(UserContext)
  return { login, logout }
}
