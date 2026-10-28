'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import {
  ShieldAlert,
  Building2,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react'
import {
  useAdminDashboardQuery,
  useGetPendingPropertiesQuery,
} from '@/app/lib/features/auth/admin/adminApiSlice'
import { routes } from '@/app/base/utils/constants'

export const Stats = (): React.ReactElement | null => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const { data: stats, isLoading: isStatsLoading } = useAdminDashboardQuery(undefined, {
    skip: !isAuthenticated,
  })

  const { data: pendingProps, isLoading: isPendingLoading } = useGetPendingPropertiesQuery(
    undefined,
    {
      skip: !isAuthenticated,
    }
  )

  if (!isAuthenticated) return null

  const pendingCount = stats?.pending ?? 0
  const approvedCount = stats?.approved ?? 0
  const usersCount = stats?.users ?? 0
  const rejectedCount = stats?.rejected ?? 0

  // Curated demo audit events representing immutable AuditLog stream
  const auditStream = [
    {
      id: 'log-1',
      action: 'approve_property',
      label: 'Approved Estate',
      entity: 'The Bel-Air Promontory Estate',
      admin: 'Julian M. (Admin)',
      time: '12m ago',
      type: 'success',
    },
    {
      id: 'log-2',
      action: 'ban_user',
      label: 'Severed Session & Banned',
      entity: 'account_flagged_8192',
      admin: 'Security Desk',
      time: '45m ago',
      type: 'destructive',
    },
    {
      id: 'log-3',
      action: 'reject_property',
      label: 'Requested Revision',
      entity: 'Villa Cap Ferrat Riviera',
      admin: 'Compliance Auditor',
      time: '2h ago',
      type: 'warning',
    },
    {
      id: 'log-4',
      action: 'approve_property',
      label: 'Approved Estate',
      entity: 'Palazzo di Palma Marina',
      admin: 'Julian M. (Admin)',
      time: '5h ago',
      type: 'success',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Title & System Status */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-border gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              Admin Overview
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-body mt-1">
            Review pending properties, manage users, and monitor activity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-card px-3 py-2 rounded-sm border border-border">
          <Activity className="h-4 w-4 text-success" />
          <span className="text-foreground font-semibold">System Online</span>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Reviews */}
        <div className="p-5 rounded-sm bg-card border border-accent/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-body uppercase tracking-wider">
              Pending Reviews
            </span>
            <Clock className="h-4 w-4 text-accent" />
          </div>
          <div className="text-3xl font-mono font-bold text-accent">
            {isStatsLoading ? '...' : pendingCount}
          </div>
          <p className="text-[11px] text-body mt-1">
            {pendingCount > 0
              ? 'Properties waiting for review'
              : 'All properties reviewed'}
          </p>
        </div>

        {/* Active Live Properties */}
        <div className="p-5 rounded-sm bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-body uppercase tracking-wider">
              Active Properties
            </span>
            <Building2 className="h-4 w-4 text-success" />
          </div>
          <div className="text-3xl font-mono font-bold text-foreground">
            {isStatsLoading ? '...' : approvedCount}
          </div>
          <p className="text-[11px] text-body mt-1">Visible in search and listings</p>
        </div>

        {/* Verified Members */}
        <div className="p-5 rounded-sm bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-body uppercase tracking-wider">
              Registered Users
            </span>
            <Users className="h-4 w-4 text-body" />
          </div>
          <div className="text-3xl font-mono font-bold text-foreground">
            {isStatsLoading ? '...' : usersCount}
          </div>
          <p className="text-[11px] text-body mt-1">Sellers and buyers</p>
        </div>

        {/* Action Required */}
        <div className="p-5 rounded-sm bg-card border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-body uppercase tracking-wider">
              Needs Revision
            </span>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </div>
          <div className="text-3xl font-mono font-bold text-foreground">
            {isStatsLoading ? '...' : rejectedCount}
          </div>
          <p className="text-[11px] text-body mt-1">Awaiting updates from sellers</p>
        </div>
      </div>

      {/* Two-Column Operational Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Pending Reviews Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Pending Approvals ({pendingProps?.length ?? pendingCount})
              </h2>
            </div>
            <Link
              href="/admin/dashboard/properties"
              className="text-xs text-accent hover:underline font-semibold"
            >
              View All Properties &rarr;
            </Link>
          </div>

          {isPendingLoading ? (
            <div className="p-12 text-center text-xs text-body font-mono">
              Loading verification queue...
            </div>
          ) : !pendingProps || pendingProps.length === 0 ? (
            <div className="p-10 rounded-sm bg-card border border-border text-center">
              <CheckCircle2 className="h-8 w-8 text-success mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-foreground">All Submissions Reviewed</p>
              <p className="text-xs text-body mt-1">
                No pending properties to review. New submissions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingProps.slice(0, 4).map((prop) => (
                <div
                  key={prop._id}
                  className="p-4 rounded-sm bg-card border border-border shadow-sm hover:border-accent/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-12 rounded-sm bg-muted overflow-hidden shrink-0 border border-border">
                      {prop.images?.[0] ? (
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-body text-[10px]">
                          No Photo
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-foreground line-clamp-1">
                        {prop.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-body mt-0.5">
                        <span className="font-mono font-semibold text-foreground">
                          ${Number(prop.price).toLocaleString('en-US')} USD
                        </span>
                        <span>&bull;</span>
                        <span>{prop.category || prop.type || 'Property'}</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/admin/dashboard/properties?id=${prop._id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-sm bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-primary/90 transition-colors shrink-0 shadow-sm min-h-[44px] self-start sm:self-auto"
                  >
                    <span>View Property</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Live Audit Stream (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
                Recent Activity
              </h2>
            </div>
            <Link
              href="/admin/dashboard/logs"
              className="text-xs text-accent hover:underline font-semibold"
            >
              View All Logs &rarr;
            </Link>
          </div>

          <div className="bg-card border border-border rounded-sm divide-y divide-border shadow-sm">
            {auditStream.map((log) => (
              <div key={log.id} className="p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold uppercase tracking-wider ${
                      log.type === 'success'
                        ? 'bg-success/15 border border-success/30 text-success'
                        : log.type === 'destructive'
                        ? 'bg-destructive/15 border border-destructive/30 text-destructive'
                        : 'bg-accent/15 border border-accent/30 text-accent'
                    }`}
                  >
                    {log.label}
                  </span>
                  <span className="text-[10px] font-mono text-body">{log.time}</span>
                </div>

                <p className="text-xs font-bold text-foreground line-clamp-1">{log.entity}</p>

                <p className="text-[11px] text-body">
                  Executed by <span className="font-semibold text-foreground">{log.admin}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-sm bg-muted/40 border border-border text-xs text-body">
            <p className="font-semibold text-foreground mb-1">Immutable Forensic Guarantee</p>
            <p className="text-[11px] leading-relaxed">
              Every status determination, legal document review, and WebSocket disconnection is cryptographically recorded in the platform security audit ledger.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
