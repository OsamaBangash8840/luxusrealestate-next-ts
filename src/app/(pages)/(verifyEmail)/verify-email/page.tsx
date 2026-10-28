import { Suspense } from 'react'
import { VerifyEmail } from '@/app/components/user/mailVerification/verifyEmail'

const VerifyEmailPage = (): React.ReactElement => (
  <Suspense fallback={<div>Loading verify component...</div>}>
    <VerifyEmail />
  </Suspense>
)

export default VerifyEmailPage
