export interface IRegisterUser {
  username: string
  email: string
  password: string
  role: 'buyer' | 'seller' | 'admin'
  phone: string
}

export interface IData {
  registerUser: IRegisterUser
  token: string
}

export interface IRegisterUserResponse {
  success: boolean
  data: IData
  error: string | null
}

export interface IRegisterRequestBody {
  username: string
  email: string
  password: string
  role: 'buyer' | 'seller' | 'admin'
  phone: string
}
