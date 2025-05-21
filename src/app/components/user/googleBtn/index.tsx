'use client'

import React from 'react'

export const GoogleLoginButton: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google'
  }

  return (
    <button
      onClick={handleGoogleLogin}
      className="flex items-center justify-center w-full bg-white border p-2 rounded"
    >
      Continue with Google
    </button>
  )
}
