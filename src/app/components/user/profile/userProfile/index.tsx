'use client'
import { routes } from '@/app/base/utils/constants'
import { MImage } from '@/app/components/common'
import { Button } from '@/app/components/common/Button'
import { useProfileQuery } from '@/app/lib/features/profile/profileApiSlice'
import Link from 'next/link'
import { LogoutButton } from '../logOut'

export const UserProfile = (): React.ReactElement => {
  const { data: profile, isLoading, error } = useProfileQuery()

  if (isLoading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-red-500 p-4">Error: {(error as any).message}</div>

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-20 relative">
      {/* Background Section */}
      <div className="absolute top-0 left-0 w-full h-[34%] bg-primary"></div>

      {/* Profile Card */}
      <div className="relative sm:mt-[50px] mt-[40px] z-10 bg-white shadow-lg rounded-lg p-6 sm:max-w-md max-w-[400px] w-full">
        {/* Profile Image (Placeholder or Real Image) */}
        <div className="flex justify-center -mt-16">
          <MImage
            src={profile?.avatar || 'https://via.placeholder.com/100'}
            alt="Profile"
            className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md"
            w={96}
            h={96}
          />
        </div>
        <Link
          href={routes.updateProfile}
          className="flex justify-end -mt-12 text-[14px] font-bold "
        >
          Edit
        </Link>

        {/* User Info */}
        <h2 className="text-xl font-bold text-center mt-10">{profile?.username}</h2>
        <p className="text-gray-500 text-center mt-2">{profile?.email}</p>
        <p className="text-gray-500 text-center mt-2">Phone No : {profile?.phone}</p>
        <p className="text-gray-500 text-center mt-2 capitalize">User Role : {profile?.role}</p>

        {/* User Stats */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between px-4 py-2 bg-gray-100 rounded-md">
            <span className="font-semibold">Total Properties:</span>
            <span>{profile?.propertyCount}</span>
          </div>
        </div>
        <LogoutButton />
      </div>
    </div>
  )
}
