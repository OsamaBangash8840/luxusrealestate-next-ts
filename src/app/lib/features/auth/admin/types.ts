export interface DashboardStats {
  users: number
  properties: number
  pending: number
  approved: number
  rejected: number
}

export interface AdminUser {
  _id: string
  username: string
  email: string
  role: 'seller' | 'user' | 'admin'
  isBanned?: boolean
  isEmailVerified?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface UsersResponse {
  users: AdminUser[]
  pagination: {
    total: number
    page: number
    pages: number
  }
}
