import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getCookie, setCookie, deleteCookie } from 'cookies-next'
import { USER_DATA, TOKEN_KEY } from '@/app/base/utils/constants'

export interface UserProfile {
  id?: string
  _id?: string
  username?: string
  name?: string
  email?: string
  role?: 'buyer' | 'seller' | 'admin' | string
  phone?: string
  avatar?: string
  isBanned?: boolean
  isEmailVerified?: boolean
  createdAt?: string
  updatedAt?: string
  [key: string]: any
}

export interface AuthState {
  user: UserProfile | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true, // starts loading until initial client sync
}

const extractUserData = (raw: any): UserProfile | null => {
  if (!raw) return null
  if (typeof raw === 'object') {
    if (raw.user && typeof raw.user === 'object') return raw.user
    if (raw.data?.user && typeof raw.data?.user === 'object') return raw.data.user
    if (raw.data && typeof raw.data === 'object' && (raw.data.email || raw.data.username || raw.data.id)) return raw.data
    return raw
  }
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw)
      return extractUserData(parsed)
    } catch {
      return null
    }
  }
  return null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserProfile | any; token?: string | null }>
    ) => {
      const extractedUser = extractUserData(action.payload.user)
      const token = action.payload.token || extractedUser?.token || state.token || null

      state.user = extractedUser
      state.token = token
      state.isAuthenticated = Boolean(extractedUser || token)
      state.isLoading = false

      if (typeof window !== 'undefined') {
        const cookieMaxAge = 60 * 60 * 24 * 7 // 7 days
        if (extractedUser) {
          setCookie(USER_DATA, JSON.stringify(extractedUser), { maxAge: cookieMaxAge, path: '/' })
        }
        if (token) {
          setCookie(TOKEN_KEY, token, { maxAge: cookieMaxAge, path: '/' })
        }
        window.dispatchEvent(new Event('luxus-auth-changed'))
      }
    },

    updateUser: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        if (typeof window !== 'undefined') {
          setCookie(USER_DATA, JSON.stringify(state.user), { maxAge: 60 * 60 * 24 * 7, path: '/' })
          window.dispatchEvent(new Event('luxus-auth-changed'))
        }
      }
    },

    syncFromCookies: (state) => {
      if (typeof window === 'undefined') {
        state.isLoading = false
        return
      }

      const rawUserCookie = getCookie(USER_DATA)
      const rawTokenCookie = getCookie(TOKEN_KEY)

      const extractedUser = extractUserData(rawUserCookie)
      const token = (typeof rawTokenCookie === 'string' && rawTokenCookie.length > 0)
        ? rawTokenCookie
        : (extractedUser?.token || null)

      state.user = extractedUser
      state.token = token
      state.isAuthenticated = Boolean(extractedUser || token)
      state.isLoading = false
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isLoading = false

      if (typeof window !== 'undefined') {
        deleteCookie(TOKEN_KEY, { path: '/' })
        deleteCookie(USER_DATA, { path: '/' })
        window.dispatchEvent(new Event('luxus-auth-changed'))
      }
    },
  },
})

export const { setCredentials, updateUser, syncFromCookies, logout } = authSlice.actions

export default authSlice.reducer
