/**
 * Shared helpers for rendering backend Property data honestly.
 * Rule: never invent values. If a field is missing, return '' / null so the UI can hide it.
 */

export const formatAddress = (addr: unknown): string => {
  if (!addr) return ''
  if (typeof addr === 'string') return addr.trim()
  if (typeof addr === 'object') {
    const a = addr as Record<string, unknown>
    return [a.street, a.city, a.state, a.country]
      .filter((v) => typeof v === 'string' && v.trim())
      .join(', ')
  }
  return ''
}

/** Short "City, Country" form for cards. Falls back to the full address. */
export const formatShortAddress = (addr: unknown): string => {
  if (addr && typeof addr === 'object') {
    const a = addr as Record<string, unknown>
    const short = [a.city, a.country].filter((v) => typeof v === 'string' && v.trim()).join(', ')
    if (short) return short
  }
  return formatAddress(addr)
}

/** Normalises the various API envelope shapes into a plain array. */
export const toArray = <T = any>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[]
  const r = raw as any
  if (Array.isArray(r?.data)) return r.data
  if (Array.isArray(r?.properties)) return r.properties
  return []
}

/** Category may be a populated object or a raw ObjectId string. */
export const getCategoryId = (category: unknown): string => {
  if (!category) return ''
  if (typeof category === 'object') return String((category as any)._id || '')
  return String(category)
}

export const getCategoryName = (category: unknown): string => {
  if (category && typeof category === 'object') return String((category as any).name || '')
  return ''
}

/** Human label for the public sale status. Admin moderation status is never shown to buyers. */
export const saleStatusLabel = (propertyStatus?: string): string => {
  switch ((propertyStatus || '').toLowerCase()) {
    case 'sold':
      return 'Sold'
    case 'under offer':
      return 'Under offer'
    case 'for sale':
      return 'For sale'
    default:
      return ''
  }
}

export const capitalize = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

