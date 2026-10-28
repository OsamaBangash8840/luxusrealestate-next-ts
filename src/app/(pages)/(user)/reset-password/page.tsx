import React, { Suspense } from 'react'
import { ResetPassword } from '@/app/components/user/resetPassword'

const ResetPasswordPage = (): React.ReactElement => (
  <Suspense fallback={<div className="p-12 text-center text-xs text-body font-mono">Loading authentication portal...</div>}>
    <ResetPassword />
  </Suspense>
)

export default ResetPasswordPage
