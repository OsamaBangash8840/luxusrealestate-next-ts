import { axiosInstance, baseURL } from '@/app/base/utils/axiosInstance';
import { getCookie } from 'cookies-next'; // Import to get cookies
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
        // Get the token from cookies
        const token = getCookie('token');

        // If a token is available, add it to the headers
        const tokenHeaders = token ? { Authorization: `Bearer ${token}` } : {};

        // Merge the provided headers with the token headers
        const mergedHeaders = { ...headers, ...tokenHeaders };

        try {
            const result: AxiosResponse = await axiosInstance({
                url: baseUrl + url,
                method,
                data,
                params,
                headers: mergedHeaders, // Use the merged headers
            });

            return { data: result.data };
        } catch (axiosError) {
            const err = axiosError as AxiosError;
            return {
                error: err?.response?.data,
            };
        }
    };

export default axiosBaseQuery;
