import Link from 'next/link'
import { Eye, EyeOff, Loader2, Mail, Lock, User, CheckCircle2, AlertCircle } from 'lucide-react'

// Email Verification Success/Pending Page
export const VerifyEmailSent = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-gray-600">
            We've sent a verification link to your email address. Please click the link to verify
            your account.
          </p>

          <div className="mt-6 space-y-4">
            <Link
              href="/resend-email"
              className="block w-full text-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Resend verification email
            </Link>

            <Link
              href="/login"
              className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
