export interface IUserProfile {
  username: string
  email: string
  phone?: string
  role: string
  avatar?: string
  propertyCount?: string
}

export interface IUpdateProfile {
  username: string
  phone: string
  role: 'buyer' | 'seller'
}
