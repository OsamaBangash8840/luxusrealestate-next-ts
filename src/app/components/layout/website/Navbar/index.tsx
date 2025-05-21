'use client'
import { routes } from '@/app/base/utils/constants'
import { MImage } from '@/app/components/common'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Images } from '../../../../../../public/images'
import { NavMenu } from '../NavbarMenu'
import { Button } from '@/app/components/common/Button'
import AdminLoginPage from '@/app/(pages)/(user)/login/page'
import { getCookie } from 'cookies-next'

export const Navbar = (): React.ReactElement => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const cookieToken = getCookie('token')
    // console.log('Token from cookie:', cookieToken) // Debugging
    setToken(typeof cookieToken === 'string' ? cookieToken : null) // Ensure it's a string
  }, [])
  return (
    <div className="grid grid-cols-2 md:grid-cols-[20%_50%_25%] items-center lg:mt-[-50px] lg:mb-[-40px]">
      <div className="flex justify-center">
        <Link href={routes.home}>
          <MImage src={Images.AppLogo} alt="logo" w={220} h={80} className="mx-auto" />
        </Link>
      </div>
      <div className="flex justify-end lg:justify-center mr-[60px] lg:mr-[0]">
        <NavMenu />
      </div>
      {/* Buttons only visible on large screens */}
      <div className="hidden lg:flex gap-3 ml-6">
        <Button className="bg-primary text-white text-center" href={routes.addProperty}>
          Add Property
        </Button>
        {token ? (
          <Button className="border-white" href={routes.profile}>
            <MImage
              src={'https://via.placeholder.com/100'}
              alt="Profile"
              className="w-14 h-14 rounded-full bg-white border-4 border-white shadow-md"
              w={96}
              h={96}
            />
          </Button>
        ) : (
          <AdminLoginPage />
        )}
      </div>
    </div>
  )
}
