import { useQuery } from '@tanstack/react-query'
import userService from '../services/users'


export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll
  })
}

