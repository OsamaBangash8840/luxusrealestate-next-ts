'use client'
import { Button } from '@/app/components/common/Button'
import { TextAreaField } from '@/app/components/form'
import { useUpdatePropertyStatusMutation } from '@/app/lib/features/auth/admin/dashboard/propertyStatus/propertyStatusApiSlice'
import { useState } from 'react'
import { toast } from 'react-toastify'

interface PropertyStatusProps {
  propertyId: string
  onStatusChange?: (status: 'approved' | 'rejected', reason?: string) => void
}

export const PropertyStatusButtons: React.FC<PropertyStatusProps> = ({
  propertyId,
  onStatusChange,
}) => {
  const [updatePropertyStatus] = useUpdatePropertyStatusMutation()
  const [showRejectionInput, setShowRejectionInput] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleApprove = async () => {
    try {
      await updatePropertyStatus({ id: propertyId, status: 'approved' }).unwrap()
      toast.success('Property Approved Successfully')
      if (onStatusChange) onStatusChange('approved')
    } catch (error: any) {
      toast.error(error)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error('Rejection Reason is Required')
      return
    }
    try {
      await updatePropertyStatus({ id: propertyId, status: 'rejected', rejectionReason }).unwrap()
      toast.success('Property Rejected Successfully!')
      setShowRejectionInput(false)
      if (onStatusChange) onStatusChange('rejected', rejectionReason)
    } catch (error) {
      toast.error('Error rejecting property')
    }
  }
  return (
    <>
      <div className="">
        <Button
          className=" mx-auto w-[260px] border-green-500 bg-green-500 text-white"
          onClick={handleApprove}
        >
          Approve
        </Button>
        <Button
          className="mx-auto w-[260px] border-red-500 bg-red-500 text-white"
          onClick={() => setShowRejectionInput(true)}
        >
          Reject
        </Button>
      </div>

      {showRejectionInput && (
        <div className="mt-6">
          <TextAreaField
            className="w-full p-2 border rounded-md"
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
          <Button className="mt-2 bg-red-600 text-white w-full" onClick={handleReject}>
            Submit Rejection
          </Button>
        </div>
      )}
    </>
  )
}
