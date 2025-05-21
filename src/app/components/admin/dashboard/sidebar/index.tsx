import { MImage } from '@/app/components/common'
import React, { useState } from 'react'
import { CiEdit, CiWallet } from 'react-icons/ci'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi'
import { HiOutlineDocumentText, HiOutlineUser } from 'react-icons/hi2'
import { PiCalendarDotsLight } from 'react-icons/pi'
import { RxDashboard } from 'react-icons/rx'
import { Images } from '../../../../../../public/images'

function Sidebar({ isActive, handleLinkClick, sidebarRef, isSidebarOpen }: any) {
  const [isTruckMenuOpen, setIsTruckMenuOpen] = useState(false)

  return (
    <div
      style={{ scrollbarWidth: 'none' }}
      ref={sidebarRef}
      className={`fixed top-0 left-0 overflow-y-scroll min-w-[300px] text-nowrap md:relative z-40 bg-[#fff] text-[#000] w-64 md:w-1/6 py-[30px] px-[20px] h-full flex flex-col transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4 sm:-mt-14">
        <MImage src={Images.AppLogo} alt="Logo" w={200} h={60} />
      </div>
      <ul className="space-y-4 flex-1 mb-10 -mt-8">
        <li>
          <button
            onClick={() => handleLinkClick('/admin/dashboard')}
            className={`flex items-center px-4 py-3 w-full rounded-md text-left transition ${
              isActive('/admin/dashboard') ? 'bg-primary text-white' : 'hover:bg-primary/30'
            }`}
          >
            <RxDashboard className="mr-3" size={20} />
            Dashboard
          </button>
        </li>
        <li>
          <button
            onClick={() => handleLinkClick('/admin/dashboard/approved-properties')}
            className={`flex items-center px-4 py-3 w-full rounded-md text-left transition ${
              isActive('/admin/dashboard/approved-properties')
                ? 'bg-primary text-white'
                : 'hover:bg-primary/30'
            }`}
          >
            <HiOutlineDocumentText className="mr-3" size={20} />
            Approved Properties
          </button>
        </li>
        <li>
          <button
            onClick={() => handleLinkClick('/admin/dashboard/pending-properties')}
            className={`flex items-center px-4 py-3 w-full rounded-md text-left transition ${
              isActive('/admin/dashboard/pending-properties')
                ? 'bg-primary text-white'
                : 'hover:bg-primary/30'
            }`}
          >
            <CiWallet className="mr-3" size={20} />
            Pending Properties
          </button>
        </li>
        <li>
          <button
            onClick={() => handleLinkClick('/admin/dashboard/rejected-properties')}
            className={`flex items-center px-4 py-3 w-full rounded-md text-left transition ${
              isActive('/admin/dashboard/rejected-properties')
                ? 'bg-primary text-white'
                : 'hover:bg-primary/30'
            }`}
          >
            <PiCalendarDotsLight className="mr-3" size={20} />
            Rejected Properties
          </button>
        </li>{' '}
        <li>
          <button
            onClick={() => setIsTruckMenuOpen(!isTruckMenuOpen)}
            className={`flex items-center px-4 py-3 w-full rounded-md text-left transition ${
              isActive('/dashboard/dispute-tickets') ||
              isActive('/dashboard/faqs') ||
              isActive('/dashboard/driver-view')
                ? 'bg-primary text-white'
                : 'hover:bg-primary/30'
            }`}
          >
            <CiEdit className="mr-3" size={20} />
            Inbox
            <span className="ml-auto">
              {isTruckMenuOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </span>
          </button>
          {isTruckMenuOpen && (
            <ul className="pl-8 mt-2 space-y-2">
              <li>
                <button
                  onClick={() => handleLinkClick('/dashboard/faqs')}
                  className={`flex items-center px-4 py-2 w-full rounded-md text-left transition ${
                    isActive('/dashboard/faqs') ? 'bg-primary text-white' : 'hover:bg-primary/30'
                  }`}
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleLinkClick('/dashboard/dispute-tickets')}
                  className={`flex items-center px-4 py-2 w-full rounded-md text-left transition ${
                    isActive('/dashboard/dispute-tickets')
                      ? 'bg-primary text-white'
                      : 'hover:bg-primary/30'
                  }`}
                >
                  Dispute Ticket
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>
      <p className="mt-auto pb-2  text-[gray] text-sm text-center select-none">
        © Copyright All Right Reserved
      </p>
    </div>
  )
}

export default Sidebar
