import React from 'react'
import { AiOutlineDown, AiOutlineMenu } from 'react-icons/ai'
import { Merriweather } from 'next/font/google'
import { Typography } from '@/app/components/common'
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
})
function Header({
  toggleSidebar,
  dropdownRef,
  toggleDropdown,
  isDropdownOpen,
  handleLinkClick,
}: any) {
  const getFormattedDate = () =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

  return (
    <header className="w-full  sticky top-0 px-1 py-[20px] bg-[#fff]   flex items-center justify-between z-50">
      <button onClick={toggleSidebar} className="text-gray-800 md:hidden focus:outline-none">
        <AiOutlineMenu size={24} />
      </button>

      <div className="px-[25px]">
        <h1 className={` sm:text-[20px] text-[16px] font-bold text-[#052145] `}>Welcome Back!</h1>
        <p className="text-[14px] text-[#052145]  my-2 hidden md:block">
          This is Your Properties Report
        </p>
      </div>
      <div>
        <Typography variant="h4" className="hidden sm:block">
          {getFormattedDate()}
        </Typography>
      </div>
      <div className="relative px-[25px]" ref={dropdownRef}>
        <div className="flex items-center select-none cursor-pointer" onClick={toggleDropdown}>
          <img
            src="/assets/images/user.png"
            alt="User Avatar"
            className="w-10 border h-10 rounded-full"
          />
          <div className="ml-3">
            <Typography className="text-[16px] font-medium text-[#052145]  hidden md:block">
              Admin
            </Typography>
          </div>
          <AiOutlineDown className="ml-2 text-gray-800 " size={18} />
        </div>

        {isDropdownOpen && (
          <div className="absolute select-none right-1 mt-2 w-48 bg-white  border border-gray-200  rounded-md shadow-lg z-50">
            <ul>
              <li>
                <button
                  onClick={() => handleLinkClick('/')}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 "
                >
                  Nagel Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/dashboard/setting')}
                  className=" w-full text-left block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 "
                >
                  Settings
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700  hover:bg-gray-100 "
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
