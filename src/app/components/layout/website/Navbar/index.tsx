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
    <div className=" container flex items-center justify-between py-4 ">
      <div className="flex shrink-0">
        <Link href={routes.home}>
          <MImage src={Images.AppLogo} alt="logo" w={120} h={80} className="mx-auto" />
        </Link>
      </div>
      <div className="flex-1 flex justify-center mr-[60px] lg:mr-0">
        <NavMenu />
      </div>
      {/* Buttons only visible on large screens */}
      <div className="hidden lg:flex items-center gap-3 shrink-0">
        <Button className=" text-foreground text-center !px-3" title="Log In" variant='login' />
        {token ? (
          <Button className="border-white" title="Profile">
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
