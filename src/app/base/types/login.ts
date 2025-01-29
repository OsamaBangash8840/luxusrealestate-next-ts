export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    role: string
  }
}

export interface LoginError {
  [x: string]: any
  message: string
  needsVerification?: boolean
}
