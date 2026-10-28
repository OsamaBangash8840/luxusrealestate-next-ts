import { getCookie } from 'cookies-next'
import { USER_DATA } from './constants'

export const getUser = () => {
  const userData = getCookie(USER_DATA)

  if (userData && typeof userData === 'string') {
    try {
      const parsed = JSON.parse(decodeURIComponent(userData))
      return parsed?.user || parsed?.data?.user || parsed
    } catch {
      try {
        const parsed = JSON.parse(userData)
        return parsed?.user || parsed?.data?.user || parsed
      } catch (error) {
        console.warn('Error parsing user data from cookie:', error)
        return null
      }
    }
  }
  return null
}
