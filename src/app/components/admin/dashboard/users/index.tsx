'use client'

import React, { useState } from 'react'
import {
  Users,
  Search,
  ShieldCheck,
  ShieldAlert,
  UserX,
  UserCheck,
  Mail,
  AlertCircle,
  Activity,
  Filter,
} from 'lucide-react'
import {
  useGetAdminUsersQuery,
  useBanUserMutation,
} from '@/app/lib/features/auth/admin/adminApiSlice'
import { AdminUser } from '@/app/lib/features/auth/admin/types'
import { toast } from 'react-toastify'

type RoleFilter = 'all' | 'seller' | 'user' | 'admin' | 'banned'

export const MemberModeration = (): React.ReactElement => {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [userToModerate, setUserToModerate] = useState<AdminUser | null>(null)

  const { data, isLoading, refetch } = useGetAdminUsersQuery({
    page,
    limit: 20,
    role: roleFilter === 'all' || roleFilter === 'banned' ? undefined : roleFilter,
  })

  const [banUser, { isLoading: isBanning }] = useBanUserMutation()

  const rawUsers = data?.users || []

  // Filter client-side for banned or search query
  const filteredUsers = rawUsers.filter((u) => {
    if (roleFilter === 'banned' && !u.isBanned) return false
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u._id?.toLowerCase().includes(q)
    )
  })

  const handleConfirmBanToggle = async () => {
    if (!userToModerate) return
    const newBannedState = !userToModerate.isBanned

    try {
      await banUser({
        id: userToModerate._id,
        isBanned: newBannedState,
      }).unwrap()

      if (newBannedState) {
        toast.success(
          `User ${userToModerate.username} suspended. Active WebSockets severed and session terminated.`
        )
      } else {
        toast.success(`User ${userToModerate.username} reinstated to active status.`)
      }
      setUserToModerate(null)
      refetch()
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update user moderation state')
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-border gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Security Governance &bull; Membership Desk
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Member Directory &amp; Moderation
          </h1>
          <p className="text-xs text-body mt-1">
            Inspect verified buyer and seller accounts, manage platform accreditation, and sever compromised sessions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-card px-3 py-2 rounded-sm border border-border">
          <Activity className="h-4 w-4 text-success" />
          <span className="text-foreground font-semibold">Active Socket Server Synchronized</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Role Segmented Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {(
            [
              { key: 'all', label: 'All Members' },
              { key: 'seller', label: 'Sellers' },
              { key: 'user', label: 'Buyers (HNW)' },
              { key: 'admin', label: 'Administrators' },
              { key: 'banned', label: 'Suspended' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setRoleFilter(item.key)
                setPage(1)
              }}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                roleFilter === item.key
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-card text-body hover:text-foreground border border-border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-body" />
          <input
            type="text"
            placeholder="Search by username, email or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-sm bg-card border border-border text-foreground text-xs focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-body font-mono">
            Loading verified member directory...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="h-10 w-10 text-body mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold text-foreground">No Members Found</p>
            <p className="text-xs text-body mt-1">
              No accounts match the current filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-[11px] font-mono text-body uppercase tracking-wider">
                  <th className="py-3 px-4">Member Account</th>
                  <th className="py-3 px-4">Role Classification</th>
                  <th className="py-3 px-4">Compliance Status</th>
                  <th className="py-3 px-4">Real-Time Presence</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                {filteredUsers.map((user) => {
                  const isAdmin = user.role === 'admin'
                  const isBanned = !!user.isBanned

                  return (
                    <tr
                      key={user._id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      {/* Member Account */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center font-bold text-xs text-foreground uppercase">
                            {user.username?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-foreground block">
                              {user.username}
                            </span>
                            <span className="text-[11px] font-mono text-body">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Classification */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] font-mono text-[10px] font-bold uppercase tracking-wider ${
                            user.role === 'admin'
                              ? 'bg-accent/15 border border-accent/40 text-accent'
                              : user.role === 'seller'
                              ? 'bg-primary/10 border border-primary/30 text-foreground'
                              : 'bg-muted border border-border text-body'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Compliance Status */}
                      <td className="py-3.5 px-4">
                        {isBanned ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-destructive/15 border border-destructive/30 text-destructive text-[11px] font-semibold">
                            <ShieldAlert className="h-3 w-3" />
                            <span>Suspended / Banned</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-success/15 border border-success/30 text-success text-[11px] font-semibold">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Active Verified</span>
                          </span>
                        )}
                      </td>

                      {/* Real-Time Presence */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-body">
                          <span className="h-2 w-2 rounded-full bg-success" />
                          <span>Connected</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {isAdmin ? (
                          <span className="text-[11px] font-mono text-body opacity-60">
                            Immutable Admin
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setUserToModerate(user)}
                            className={`px-3 py-1.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all min-h-[36px] ${
                              isBanned
                                ? 'bg-success text-success-foreground hover:bg-success/90'
                                : 'border border-destructive/40 text-destructive hover:bg-destructive/10'
                            }`}
                          >
                            {isBanned ? 'Reinstate' : 'Sever & Ban'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ban / Reinstatement Confirmation Modal */}
      {userToModerate && (
        <div className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-sm max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 text-destructive font-bold text-sm uppercase tracking-wider">
              <AlertCircle className="h-5 w-5" />
              <span>
                {userToModerate.isBanned ? 'Reinstate Member Access' : 'Sever Session & Suspend Member'}
              </span>
            </div>

            <p className="text-xs text-body leading-relaxed">
              {userToModerate.isBanned ? (
                <>
                  Are you sure you want to lift the suspension for{' '}
                  <strong className="text-foreground">{userToModerate.username}</strong> (
                  {userToModerate.email})? This will restore their access to catalogue negotiations and seller tools.
                </>
              ) : (
                <>
                  Suspending <strong className="text-foreground">{userToModerate.username}</strong> will
                  immediately sever all active WebSocket connections across server clusters (
                  <code className="text-destructive font-mono">socket.disconnect(true)</code>), ejecting them from active negotiations, and creating an immutable forensic entry in <code className="text-foreground font-mono">AuditLog</code>.
                </>
              )}
            </p>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setUserToModerate(null)}
                className="px-4 py-2 rounded-sm border border-border text-foreground hover:bg-muted text-xs font-semibold transition-colors min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmBanToggle}
                disabled={isBanning}
                className={`px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider transition-opacity min-h-[44px] shadow-sm disabled:opacity-50 ${
                  userToModerate.isBanned
                    ? 'bg-success text-success-foreground hover:opacity-90'
                    : 'bg-destructive text-destructive-foreground hover:opacity-90'
                }`}
              >
                {isBanning
                  ? 'Processing...'
                  : userToModerate.isBanned
                  ? 'Confirm Reinstatement'
                  : 'Confirm Ban & Sever Sockets'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
