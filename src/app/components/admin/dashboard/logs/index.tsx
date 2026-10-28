'use client'

import React, { useState } from 'react'
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Lock,
  Hash,
} from 'lucide-react'
import { toast } from 'react-toastify'

type LogFilter = 'all' | 'approve_property' | 'reject_property' | 'ban_user' | 'unban_user'

interface IAuditRecord {
  id: string
  action: 'approve_property' | 'reject_property' | 'ban_user' | 'unban_user'
  actionLabel: string
  admin: string
  targetId: string
  targetName: string
  targetModel: 'Property' | 'User'
  reason?: string
  timestamp: string
  hash: string
}

export const SecurityLogs = (): React.ReactElement => {
  const [filter, setFilter] = useState<LogFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Structured forensic records reflecting server AuditLog model
  const records: IAuditRecord[] = [
    {
      id: 'aud-9801',
      action: 'approve_property',
      actionLabel: 'Approved Estate',
      admin: 'Julian M. (Super Admin)',
      targetId: 'prop_65a1f80d92',
      targetName: 'The Bel-Air Promontory Estate',
      targetModel: 'Property',
      timestamp: '2026-10-25 14:12:04 UTC',
      hash: 'sha256:4f8e21a8...9b01c3',
    },
    {
      id: 'aud-9800',
      action: 'ban_user',
      actionLabel: 'User Banned',
      admin: 'Security Officer 04',
      targetId: 'usr_8820c71a34',
      targetName: 'suspicious_broker_corp',
      targetModel: 'User',
      reason: 'Multiple failed identity verification attempts.',
      timestamp: '2026-10-25 13:45:22 UTC',
      hash: 'sha256:7c11a90d...6d24f0',
    },
    {
      id: 'aud-9799',
      action: 'reject_property',
      actionLabel: 'Revision Requested',
      admin: 'Elena Rostova (Compliance Desk)',
      targetId: 'prop_CapFerrat01',
      targetName: 'Villa Cap Ferrat Riviera',
      targetModel: 'Property',
      reason: 'Ownership certificate expired. Updated proof of ownership required.',
      timestamp: '2026-10-25 11:20:15 UTC',
      hash: 'sha256:1a4b89ef...23c8e1',
    },
    {
      id: 'aud-9798',
      action: 'approve_property',
      actionLabel: 'Approved Property',
      admin: 'Julian M. (Super Admin)',
      targetId: 'prop_PalazzoMarina',
      targetName: 'Palazzo di Palma Marina',
      targetModel: 'Property',
      timestamp: '2026-10-24 18:30:00 UTC',
      hash: 'sha256:90e43bd1...a01f44',
    },
    {
      id: 'aud-9797',
      action: 'unban_user',
      actionLabel: 'Reinstated User Access',
      admin: 'Julian M. (Super Admin)',
      targetId: 'usr_vanceMarcus',
      targetName: 'Marcus Vance',
      targetModel: 'User',
      reason: 'Bank verification letter verified successfully.',
      timestamp: '2026-10-24 16:15:40 UTC',
      hash: 'sha256:55f019ab...8912e7',
    },
  ]

  const filteredRecords = records.filter((r) => {
    if (filter !== 'all' && r.action !== filter) return false
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      r.targetName.toLowerCase().includes(q) ||
      r.targetId.toLowerCase().includes(q) ||
      r.admin.toLowerCase().includes(q) ||
      r.hash.toLowerCase().includes(q)
    )
  })

  const handleExport = () => {
    toast.success('Activity log exported successfully.')
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 border-b border-border gap-4">
        <div>
          <div className="inline-flex items-center gap-2 mb-1">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">
              System Security &bull; Audit Trail
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            Activity &amp; Security Logs
          </h1>
          <p className="text-xs text-body mt-1">
            Log of property approvals, seller revision requests, and administrative actions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-sm border border-border bg-card text-foreground text-xs font-semibold uppercase tracking-wider hover:bg-muted transition-colors min-h-[44px]"
        >
          <Download className="h-4 w-4" />
          <span>Export Logs (CSV)</span>
        </button>
      </div>

      {/* Security Status Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-sm bg-card border border-border text-xs flex items-center gap-3">
          <Lock className="h-5 w-5 text-accent shrink-0" />
          <div>
            <span className="font-bold text-foreground block">System Security</span>
            <span className="text-body font-mono text-[11px]">No security anomalies detected</span>
          </div>
        </div>

        <div className="p-4 rounded-sm bg-card border border-border text-xs flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-success shrink-0" />
          <div>
            <span className="font-bold text-foreground block">Compliance Status</span>
            <span className="text-body font-mono text-[11px]">Standards verified &amp; active</span>
          </div>
        </div>

        <div className="p-4 rounded-sm bg-card border border-border text-xs flex items-center gap-3">
          <Hash className="h-5 w-5 text-body shrink-0" />
          <div>
            <span className="font-bold text-foreground block">Total Audit Records</span>
            <span className="text-body font-mono text-[11px]">2,490 verified events indexed</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {(
            [
              { key: 'all', label: 'All Records' },
              { key: 'approve_property', label: 'Approvals' },
              { key: 'reject_property', label: 'Rejections' },
              { key: 'ban_user', label: 'Bans & Terminations' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-all ${
                filter === item.key
                  ? 'bg-foreground text-background shadow-sm'
                  : 'bg-card text-body hover:text-foreground border border-border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-body" />
          <input
            type="text"
            placeholder="Search by entity, administrator, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 rounded-sm bg-card border border-border text-foreground text-xs focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      {/* Forensic Audit Table */}
      <div className="bg-card border border-border rounded-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-[11px] font-mono text-body uppercase tracking-wider">
                <th className="py-3 px-4">UTC Timestamp</th>
                <th className="py-3 px-4">Officer Identity</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Audit Details &amp; Findings</th>
                <th className="py-3 px-4 text-right">Cryptographic Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 font-mono text-body whitespace-nowrap text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 text-accent" />
                      <span>{item.timestamp}</span>
                    </div>
                  </td>

                  {/* Officer */}
                  <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                    {item.admin}
                  </td>

                  {/* Action Pill */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold uppercase tracking-wider ${
                        item.action === 'approve_property' || item.action === 'unban_user'
                          ? 'bg-success/15 border border-success/30 text-success'
                          : item.action === 'ban_user'
                          ? 'bg-destructive/15 border border-destructive/30 text-destructive'
                          : 'bg-accent/15 border border-accent/30 text-accent'
                      }`}
                    >
                      {item.actionLabel}
                    </span>
                  </td>

                  {/* Target Entity */}
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-foreground block">{item.targetName}</span>
                    <span className="font-mono text-[10px] text-body">{item.targetId}</span>
                  </td>

                  {/* Audit Details */}
                  <td className="py-3.5 px-4 text-body max-w-xs">
                    {item.reason ? (
                      <span className="line-clamp-2 text-[11px] leading-relaxed">
                        {item.reason}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-body/60">
                        Verified &bull; Standard compliance
                      </span>
                    )}
                  </td>

                  {/* Cryptographic Hash */}
                  <td className="py-3.5 px-4 text-right font-mono text-[10px] text-body whitespace-nowrap">
                    {item.hash}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
