import { axiosInstance, baseURL } from '@/app/base/utils/axiosInstance';
import { getCookie } from 'cookies-next';
import {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: any;
  params?: any;
  headers?: AxiosRequestConfig['headers'];
}

const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: baseURL }) =>
  async ({
    url,
    method,
    data,
    params,
    headers,
  }: AxiosBaseQueryArgs): Promise<any> => {
    // Retrieve token from cookies (if needed)
    const token = getCookie('token');
    const tokenHeaders = token ? { Authorization: `Bearer ${token}` } : {};
    const mergedHeaders = { ...headers, ...tokenHeaders };

    try {
      const result: AxiosResponse = await axiosInstance({
        url: baseUrl + url,
        method,
        data,
        params,
        headers: mergedHeaders,
        withCredentials: true, // Send cookies with the request
        timeout: 10000, // Optional: Set a timeout for the request
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err?.response?.status,
          data: err?.response?.data,
          message: err?.message,
        },
      };
    }
  };

export default axiosBaseQuery;
