# RTK Query Implementation Guide with NextAuth and Protected Routes

This guide explains how to implement Redux Toolkit (RTK) Query in your Next.js projects with NextAuth for authentication and a custom API. It includes setting up RTK Query for API management and implementing protected routes using NextAuth's middleware.

## Prerequisites

- Next.js project
- Basic knowledge of React and TypeScript

## Step 1: Install Dependencies

Install the required packages:

```bash
npm install @reduxjs/toolkit react-redux axios next-auth mongodb mongoose bcryptjs jsonwebtoken
```

- `@reduxjs/toolkit`: For RTK Query and store management
- `react-redux`: For connecting React with Redux
- `axios`: For HTTP requests
- `next-auth`: For authentication
- `mongodb`: MongoDB driver
- `mongoose`: ODM for MongoDB
- `bcryptjs`: For password hashing
- `jsonwebtoken`: For JWT token management

## Step 1.5: Set Up MongoDB Atlas and Database Models

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/atlas
2. Create a new cluster (free tier is available)
3. Set up database access with a username and password
4. Configure network access (add your IP or allow access from anywhere for development)
5. Get your connection string from the "Connect" button

### Environment Variables

Add to `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/your-database-name
JWT_SECRET=your-jwt-secret-key
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

### Database Connection

Create `src/lib/mongodb.ts`:

```typescript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
}

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default connectToDatabase
```

### User Model with Lockout Protection

Create `src/lib/models/User.ts`:

```typescript
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends mongoose.Document {
  email: string
  password: string
  name: string
  failedLoginAttempts: number
  lockUntil: Date | null
  isLocked: boolean
  comparePassword(candidatePassword: string): Promise<boolean>
  incLoginAttempts(): Promise<void>
  resetLoginAttempts(): Promise<void>
}

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// Virtual for lock status
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date())
})

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Instance method to increment login attempts
userSchema.methods.incLoginAttempts = async function (): Promise<void> {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < new Date()) {
    this.failedLoginAttempts = 1
    this.lockUntil = null
  } else {
    this.failedLoginAttempts += 1
  }

  // Lock account after 3 failed attempts for 1 hour
  if (this.failedLoginAttempts >= 3) {
    this.lockUntil = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  }

  await this.save()
}

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.failedLoginAttempts = 0
  this.lockUntil = null
  await this.save()
}

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true })
userSchema.set('toObject', { virtuals: true })

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User
```

## Step 2: Set Up NextAuth Configuration

Create NextAuth configuration with database integration and account lockout.

Create `src/lib/auth.ts`:

```typescript
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectToDatabase from './mongodb'
import User from './models/User'
import jwt from 'jsonwebtoken'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          await connectToDatabase()

          const user = await User.findOne({ email: credentials?.email })

          if (!user) {
            throw new Error('Invalid credentials')
          }

          // Check if account is locked
          if (user.isLocked) {
            const remainingTime = Math.ceil((user.lockUntil!.getTime() - Date.now()) / (1000 * 60))
            throw new Error(`Account is locked. Try again in ${remainingTime} minutes.`)
          }

          // Check password
          const isValidPassword = await user.comparePassword(credentials!.password)

          if (!isValidPassword) {
            // Increment failed login attempts
            await user.incLoginAttempts()

            // Check if account should be locked after this attempt
            if (user.failedLoginAttempts >= 3) {
              throw new Error(
                'Account locked due to too many failed attempts. Try again in 1 hour.'
              )
            }

            throw new Error('Invalid credentials')
          }

          // Reset login attempts on successful login
          await user.resetLoginAttempts()

          // Generate JWT token
          const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: '7d',
          })

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            accessToken: token,
          }
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed')
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
})
```

Create API route for NextAuth: `src/app/api/auth/[...nextauth]/route.ts`

```typescript
import { handlers } from '@/lib/auth'

export const { GET, POST } = handlers
```

## Step 2.5: Create Authentication API Routes

### Registration API Route

Create `src/app/api/auth/register/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { email, password, name } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create new user
    const user = new User({
      email,
      password,
      name,
    })

    await user.save()

    return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### User Profile API Route

Create `src/app/api/auth/profile/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import connectToDatabase from '@/lib/mongodb'
import User from '@/lib/models/User'
import jwt from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const user = await User.findOne({ email: session.user.email }).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const { name } = await request.json()

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { name },
      { new: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### Account Status Check API Route

Create `src/app/api/auth/status/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()

    const { email } = await request.json()

    const user = await User.findOne({ email }).select('isLocked lockUntil failedLoginAttempts')

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    let message = ''
    if (user.isLocked) {
      const remainingTime = Math.ceil((user.lockUntil!.getTime() - Date.now()) / (1000 * 60))
      message = `Account is locked. Try again in ${remainingTime} minutes.`
    }

    return NextResponse.json({
      isLocked: user.isLocked,
      failedAttempts: user.failedLoginAttempts,
      message,
    })
  } catch (error: any) {
    console.error('Status check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Step 3: Set Up Axios Base Query with NextAuth

Create a custom base query that uses Axios and gets tokens from NextAuth session.

Create `src/lib/features/axiosBaseQuery.ts`:

```typescript
import { axiosInstance, baseURL } from '@/lib/utils/axiosInstance'
import { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

interface AxiosBaseQueryArgs {
  url: string
  method: AxiosRequestConfig['method']
  body?: any
  params?: any
  headers?: AxiosRequestConfig['headers']
}

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: baseURL }) =>
  async ({ url, method, body, params, headers }: AxiosBaseQueryArgs): Promise<any> => {
    // Get session from NextAuth (this will be handled in the component level)
    // We'll pass the token from the component using RTK Query's prepareHeaders

    try {
      const result: AxiosResponse = await axiosInstance({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers,
        withCredentials: true,
        timeout: 10000,
      })

      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err?.response?.status,
          data: err?.response?.data,
          message: err?.message,
        },
      }
    }
  }

export default axiosBaseQuery
```

## Step 4: Create API Slices with NextAuth Integration

Create API slices that include auth headers from NextAuth.

Example: `src/lib/features/auth/authApiSlice.ts`

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getSession } from 'next-auth/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: async (headers) => {
    const session = await getSession()
    if (session?.accessToken) {
      headers.set('authorization', `Bearer ${session.accessToken}`)
    }
    return headers
  },
})

export const authApiSlice = createApi({
  baseQuery,
  reducerPath: 'authApi',
  tagTypes: ['User'],
  endpoints: (build) => ({
    getCurrentUser: build.query({
      query: () => 'user/profile',
      providesTags: ['User'],
    }),
    updateProfile: build.mutation({
      query: (data) => ({
        url: 'user/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
})

export const { useGetCurrentUserQuery, useUpdateProfileMutation } = authApiSlice
```

## Step 5: Set Up the Redux Store

Create the store that combines all slices and adds middleware.

Create `src/lib/store.ts`:

```typescript
import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { authApiSlice } from './features/auth/authApiSlice'
// Import other API slices...

const rootReducer = combineSlices(
  authApiSlice
  // Add other slices...
)

export type RootState = ReturnType<typeof rootReducer>

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        authApiSlice.middleware,
        // Add middleware for other API slices...
      ]),
  })
```

## Step 6: Create Store Provider

Create a provider component to wrap your app with the Redux store.

Create `src/app/StoreProvider.tsx`:

```tsx
'use client'
import { setupListeners } from '@reduxjs/toolkit/query'
import React, { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, type AppStore } from '../lib/store'

interface Props {
  readonly children: React.ReactNode
}

export const StoreProvider = ({ children }: Props): React.ReactElement => {
  const storeRef = useRef<AppStore | null>(null)

  if (storeRef.current === null) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    if (storeRef.current != null) {
      setupListeners(storeRef.current.dispatch)
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
```

## Step 7: Set Up NextAuth Session Provider

Create a provider for NextAuth session.

Create `src/app/providers.tsx`:

```tsx
'use client'
import { SessionProvider } from 'next-auth/react'
import { StoreProvider } from './StoreProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <StoreProvider>{children}</StoreProvider>
    </SessionProvider>
  )
}
```

## Step 8: Wrap Your App with Providers

Update your root layout to include the Providers.

In `src/app/layout.tsx`:

```tsx
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## Step 9: Implement Protected Routes with NextAuth Middleware

Create middleware to protect routes using NextAuth.

Create `src/middleware.ts`:

```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAuth = !!req.auth
  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register')
  const isProtectedPage =
    req.nextUrl.pathname.startsWith('/profile') || req.nextUrl.pathname.startsWith('/dashboard')

  if (isProtectedPage && !isAuth) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
```

## Step 10: Create Authentication Components

Create login and logout components using NextAuth.

Login component: `src/components/auth/LoginForm.tsx`

```tsx
'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false, // Don't redirect automatically
      })

      if (result?.error) {
        setError(result.error)
      } else if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={isLoading}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
```

### Registration Component

Create `src/components/auth/RegisterForm.tsx`:

```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/login?message=Registration successful')
      } else {
        setError(data.error || 'Registration failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            disabled={isLoading}
          />
        </div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  )
}
```

Logout component: `src/components/auth/LogoutButton.tsx`

```tsx
'use client'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return <button onClick={() => signOut({ callbackUrl: '/login' })}>Sign Out</button>
}
```

## Step 11: Use RTK Query Hooks in Components

In your React components, use the generated hooks to make API calls.

Example component:

```tsx
'use client'
import { useGetCurrentUserQuery } from '../lib/features/auth/authApiSlice'
import { useSession } from 'next-auth/react'

export default function Profile() {
  const { data: session } = useSession()
  const {
    data: user,
    isLoading,
    error,
  } = useGetCurrentUserQuery(undefined, {
    skip: !session, // Only run query if user is authenticated
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading profile</div>

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      {/* Profile content */}
    </div>
  )
}
```

## Step 12: Environment Variables

Add to `.env.local`:

```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Additional Notes

- Adjust the API URLs and endpoints to match your custom API.
- Customize the protected routes in middleware according to your app's needs.
- For more complex authentication flows, refer to NextAuth documentation.
- Make sure to handle loading and error states in your components.
- NextAuth handles token refresh automatically if configured properly.

This setup provides a robust foundation for API management with RTK Query and authentication with NextAuth in Next.js applications.
