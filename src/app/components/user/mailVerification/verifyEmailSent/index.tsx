import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Typography } from '@/app/components/common'
import { Button } from '@/app/components/common/Button'

// Email Verification Success/Pending Page
export const VerifyEmailSent = () => {
  return (
    <div className="bg-background min-h-[90%] flex items-center justify-center p-4">
      <div className="max-w-[480px] w-full border border-border p-8 mt-10">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-primary" />
          <Typography variant="h2" className="mt-4">Check your email</Typography>
          <Typography variant="bodyRegular" className="mt-2 text-muted-foreground">
            We've sent a verification link to your email address. Please click the link to verify
            your account.
          </Typography>

          <div className="mt-6 space-y-4">
            <Button
              href="/resend-email"
              className="w-full"
            >
              Resend verification email
            </Button>

            <Button
              href="/login"
              variant="outline"
              className="w-full"
            >
              Back to login
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
