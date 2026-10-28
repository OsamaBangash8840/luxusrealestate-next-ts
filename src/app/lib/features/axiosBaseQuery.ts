import { axiosInstance, baseURL } from '@/app/base/utils/axiosInstance'
import { getCookie } from 'cookies-next'
import { USER_DATA, TOKEN_KEY } from '@/app/base/utils/constants'
import { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

interface AxiosBaseQueryArgs {
  url: string
  method: AxiosRequestConfig['method']
  body?: any
  params?: any
  headers?: AxiosRequestConfig['headers']
}

const resolveToken = (): string | null => {
  const directToken = getCookie(TOKEN_KEY)
  if (typeof directToken === 'string' && directToken.length > 0) {
    return directToken
  }

  const rawUserData = getCookie(USER_DATA)
  if (typeof rawUserData === 'string' && rawUserData.length > 0) {
    try {
      const parsed = JSON.parse(decodeURIComponent(rawUserData))
      return parsed?.token || parsed?.user?.token || parsed?.data?.token || null
    } catch {
      try {
        const parsed = JSON.parse(rawUserData)
        return parsed?.token || parsed?.user?.token || parsed?.data?.token || null
      } catch {
        return null
      }
    }
  }

  return null
}

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: baseURL }) =>
  async ({ url, method, body, params, headers }: AxiosBaseQueryArgs): Promise<any> => {
    const token = resolveToken()
    const tokenHeaders = token ? { Authorization: `Bearer ${token}` } : {}
    const mergedHeaders = { ...headers, ...tokenHeaders }

    try {
      const result: AxiosResponse = await axiosInstance({
        url: baseUrl + url,
        method,
        data: body,
        params,
        headers: mergedHeaders,
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
