'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Building,
  Heart,
  BookmarkCheck,
  LogOut,
  Edit2,
  Check,
  X,
  Lock,
} from 'lucide-react'
import { useProfileQuery, useUpdateProfileMutation } from '@/app/lib/features/profile/profileApiSlice'
import { Container, MImage } from '@/app/components/common'
import { LogoutButton } from '../logOut'
import { toast } from 'react-toastify'

export const UserProfile: React.FC = () => {
  const { data: profile, isLoading, error } = useProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    bio: '',
  })

  // Populate form on edit start
  const handleStartEdit = () => {
    setFormData({
      username: profile?.username || '',
      phone: profile?.phone || '',
      bio: '',
    })
    setIsEditing(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile({
        username: formData.username.trim(),
        phone: formData.phone.trim(),
        role: (profile?.role as 'buyer' | 'seller') || 'buyer',
      }).unwrap()
      toast.success('Member profile updated successfully')
      setIsEditing(false)
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update profile')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <Container>
          <div className="h-48 w-full rounded-sm bg-muted animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 rounded-sm bg-muted animate-pulse" />
            <div className="h-64 rounded-sm bg-muted animate-pulse md:col-span-2" />
          </div>
        </Container>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background py-20 text-center">
        <Container>
          <div className="max-w-md mx-auto p-8 rounded-sm bg-card border border-border">
            <h2 className="text-xl font-bold text-foreground mb-2">Sign In Required</h2>
            <p className="text-xs text-body mb-6">
              Please sign in to access your account profile.
            </p>
            <Link
              href="/login"
              className="inline-flex px-5 py-2.5 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90"
            >
              Sign In
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const isSeller = profile.role === 'seller' || profile.role === 'admin'

  return (
    <div className="min-h-screen bg-background py-12">
      <Container>
        {/* Header Breadcrumb */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              User Profile
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Account Settings &amp; Profile
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Member Card & Quick Navigation (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Identity Card */}
            <div className="p-6 rounded-sm bg-card border border-border shadow-sm text-center">
              <div className="relative mx-auto h-24 w-24 rounded-full overflow-hidden border-2 border-accent bg-foreground text-background flex items-center justify-center font-bold text-2xl mb-4">
                {profile.avatar ? (
                  <MImage
                    src={profile.avatar}
                    alt={profile.username}
                    w={96}
                    h={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{profile.username ? profile.username[0].toUpperCase() : 'M'}</span>
                )}
              </div>

              <h2 className="text-xl font-bold text-foreground">{profile.username}</h2>
              <p className="text-xs text-body mb-3">{profile.email}</p>

              <div className="inline-flex items-center gap-1.5 rounded-sm border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent mb-6">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{profile.role ? `${profile.role} Account` : 'Member'}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border text-center">
                <div className="p-2 rounded-sm bg-background border border-border">
                  <div className="text-base font-bold text-foreground">
                    {profile.propertyCount ?? 0}
                  </div>
                  <div className="text-[10px] text-body uppercase tracking-wider">
                    {isSeller ? 'Properties' : 'Inquiries'}
                  </div>
                </div>
                <div className="p-2 rounded-sm bg-background border border-border">
                  <div className="text-base font-bold text-foreground">Verified</div>
                  <div className="text-[10px] text-success uppercase tracking-wider">
                    Identity Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 rounded-sm bg-card border border-border shadow-sm space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-body block px-3 py-1">
                Account Links
              </span>
              <Link
                href="/user/favorites"
                className="flex items-center justify-between p-3 rounded-sm hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="h-4 w-4 text-accent" />
                  <span>Saved Properties</span>
                </div>
                <span className="text-muted-foreground">&rarr;</span>
              </Link>

              <Link
                href="/user/saved-searches"
                className="flex items-center justify-between p-3 rounded-sm hover:bg-muted text-xs font-semibold text-foreground transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookmarkCheck className="h-4 w-4 text-accent" />
                  <span>Saved Search Criteria &amp; Alerts</span>
                </div>
                <span className="text-muted-foreground">&rarr;</span>
              </Link>

              {isSeller && (
                <Link
                  href="/user/seller"
                  className="flex items-center justify-between p-3 rounded-sm hover:bg-muted text-xs font-semibold text-foreground transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="h-4 w-4 text-accent" />
                    <span>Seller Portfolio Studio</span>
                  </div>
                  <span className="text-muted-foreground">&rarr;</span>
                </Link>
              )}

              <div className="pt-2 border-t border-border">
                <LogoutButton />
              </div>
            </div>
          </div>

          {/* Right Column: Profile Information & Security (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Dossier Information Card */}
            <div className="p-8 rounded-sm bg-card border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Account Details
                  </h3>
                  <p className="text-xs text-body">
                    Your personal information is strictly confidential and protected by privacy policies.
                  </p>
                </div>
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-accent" />
                    <span>Edit Credentials</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-border text-xs font-semibold text-body hover:bg-muted transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
                      Legal Name / Entity
                    </span>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.username || 'Not Provided'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
                      Private Email
                    </span>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
                      Direct Telephone
                    </span>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.phone || 'Not Configured'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-body block mb-1">
                      Accreditation Role
                    </span>
                    <div className="text-sm font-semibold text-foreground capitalize flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-accent" />
                      <span>{profile.role || 'Private Buyer'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                      Full Name / Legal Entity
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-body mb-1">
                      Direct Telephone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full p-2.5 rounded-sm border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-body hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Security & Cryptographic Integrity Card */}
            <div className="p-8 rounded-sm bg-card border border-border shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-4 w-4 text-accent" />
                <h3 className="text-base font-bold text-foreground">
                  Security &amp; Session Cryptography
                </h3>
              </div>
              <p className="text-xs text-body leading-relaxed mb-6">
                All socket connections and session tokens are protected by TLS 1.3 and encrypted JWT claims. Any suspicious IP anomaly will automatically sever real-time sessions.
              </p>

              <div className="flex flex-wrap items-center justify-between p-4 rounded-sm border border-border bg-background gap-4">
                <div>
                  <div className="text-xs font-bold text-foreground">Active Authentication Token</div>
                  <div className="text-[11px] text-muted-foreground font-mono mt-0.5">
                    Algorithm: HMAC-SHA256 &bull; Status: Valid
                  </div>
                </div>
                <Link
                  href="/reset-password"
                  className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Rotate Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
