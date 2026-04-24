import { useReducer, createContext, useCallback, useEffect } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'
import persistentUser from '../services/persistentUser'

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return action.payload
    case 'LOGOUT':
      return null
    default:
      return state
  }
}

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)

  useEffect(() => {
      const user = persistentUser.getUser()
      if (user){
        blogService.setToken(user.token)
        dispatch({ type: 'LOGIN', payload: user })
      }
    }
  , [])

  const login = useCallback(async (username, password) => {
    const user = await loginService.login({ username, password })
    persistentUser.saveUser(user)
    blogService.setToken(user.token)
    dispatch({ type: 'LOGIN', payload: user })
  }, [])

  const logout = useCallback(() => {
    persistentUser.removeUser()
    dispatch({ type: 'LOGOUT' })
  }, [])

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
