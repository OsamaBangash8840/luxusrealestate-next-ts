'use client'

import {
  useAvailableSlotsQuery,
  useScheduleTourMutation,
} from '@/app/lib/features/scheduleTours/scheduleToursApiSlice'
import { useState } from 'react'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Modal } from '../../common/Modal'
import { Button } from '../../common/Button'
import { TextAreaField, TextField } from '../../form'

interface ScheduleTourProps {
  propertyId: string
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const ScheduleTour: React.FC<ScheduleTourProps> = ({ propertyId, isOpen, setIsOpen }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState<Date | null>(new Date())
  const [selectedTime, setSelectedTime] = useState('')

  // Fetch available slots
  const { data, error, isLoading } = useAvailableSlotsQuery({
    date: date ? date.toISOString().split('T')[0] : '',
    propertyId,
  })

  const [scheduleTour, { isLoading: isBooking }] = useScheduleTourMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTime || !date) {
      toast.error('Please select a valid date and time slot.')
      return
    }

    // Convert selected time to 24-hour format
    const convertTo24Hour = (time12h: string) => {
      const [time, modifier] = time12h.split(' ')
      let [hours, minutes] = time.split(':')

      if (modifier === 'pm' && hours !== '12') {
        hours = String(parseInt(hours, 10) + 12)
      }
      if (modifier === 'am' && hours === '12') {
        hours = '00'
      }

      return `${hours}:${minutes}`
    }

    const formattedTime = convertTo24Hour(selectedTime)

    // Create a Date object for the selected date
    const localBookingDateTime = new Date(date)
    const [hours, minutes] = formattedTime.split(':')
    localBookingDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    // Convert to UTC before sending to the backend
    const utcBookingDateTime = new Date(
      localBookingDateTime.getTime() - localBookingDateTime.getTimezoneOffset() * 60000
    )

    try {
      await scheduleTour({
        propertyId,
        name,
        email,
        phone,
        date: utcBookingDateTime.toISOString().split('T')[0], // Send in UTC
        time: formattedTime,
        message,
      }).unwrap()

      toast.success('Tour scheduled successfully.')
      setIsOpen(false)
    } catch (error) {
      toast.error(error?.data?.error || 'Error booking the tour.')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="sm:max-w-[600px] max-h-[94%] overflow-y-auto p-5"
    >
      <h2 className="text-xl font-semibold text-center mb-4">Schedule a Tour</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="font-medium">Name:</label>
        <TextField
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          // className="p-2 border rounded-md focus:ring focus:ring-blue-400"
          placeholder={''}
        />

        <label className="font-medium">Email:</label>
        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          // className="p-2 border rounded-md focus:ring focus:ring-blue-400"
          placeholder={''}
        />

        <label className="font-medium">Phone:</label>
        <TextField
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          // className="p-2 border rounded-md focus:ring focus:ring-blue-400"
          placeholder={''}
        />

        <label className="font-medium">Select Date:</label>
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          minDate={new Date()}
          required
          className="p-2 border rounded-md w-full"
        />

        <label className="font-medium">Select Time Slot:</label>
        {isLoading ? (
          <p className="text-blue-500">Loading slots...</p>
        ) : error ? (
          <p className="text-red-500">Error fetching slots</p>
        ) : (
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
            // className="p-2 border rounded-md focus:ring focus:ring-blue-400"
          >
            <option value="">Choose a time</option>
            {data?.availableSlots?.length > 0 ? (
              data.availableSlots.map((slot: { start: string; end: string }, index: number) => (
                <option key={index} value={slot.start}>
                  {slot.start} - {slot.end}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No slots available
              </option>
            )}
          </select>
        )}

        <label className="font-medium">Message:</label>
        <TextAreaField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          // className="p-2 border rounded-md focus:ring focus:ring-blue-400"
          placeholder={''}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={isBooking}>
            {isBooking ? 'Booking...' : 'Schedule Tour'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
