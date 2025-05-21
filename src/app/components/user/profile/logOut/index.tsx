'use client'
import { useLogOutMutation } from '@/app/lib/features/auth/login/authApiSlice'
import { Button } from '@/app/components/common/Button'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

export const LogoutButton = () => {
  const [logout, { isLoading }] = useLogOutMutation()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
      deleteCookie('token') // Ensure token is removed from the client side as well
      toast.success('Logged out successfully')
      router.push('/login') // Redirect user to login page
    } catch (error) {
      toast.error('Logout failed, please try again')
    }
  }

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-red-600 hover:bg-red-700 border-red-600 mx-auto text-white px-4 py-2 rounded-md"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
