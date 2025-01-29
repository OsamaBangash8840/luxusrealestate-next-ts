import { axiosInstance, baseURL } from '@/app/base/utils/axiosInstance'
import { getCookie } from 'cookies-next'
import { type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'

interface AxiosBaseQueryArgs {
  url: string
  method: AxiosRequestConfig['method']
  body?: any // Changed "data" to "body" for consistency with RTK Query
  params?: any
  headers?: AxiosRequestConfig['headers']
}

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: baseURL }) =>
  async ({ url, method, body, params, headers }: AxiosBaseQueryArgs): Promise<any> => {
    // Retrieve token from cookies
    const token = getCookie('token')
    const tokenHeaders = token ? { Authorization: `Bearer ${token}` } : {}
    const mergedHeaders = { ...headers, ...tokenHeaders }

    console.log('Token from cookies:', token) // Debugging
    console.log('Merged Headers:', mergedHeaders) // Debugging

    try {
      const result: AxiosResponse = await axiosInstance({
        url: baseUrl + url,
        method,
        data: body, // Correctly pass the body
        params,
        headers: mergedHeaders,
        withCredentials: true,
        timeout: 10000, // Optional timeout
      })

      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      console.error('Axios Error:', err) // Debugging
      console.error('API Error:', err)
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
