import axios, {
    type AxiosRequestHeaders,
    type AxiosRequestConfig,
    type AxiosError,
    type AxiosResponse,
    type AxiosInstance
} from 'axios';
import { getUser } from './getUser';

// Define a custom type for the request configuration, ensuring headers are included
interface AdaptAxiosRequestConfig extends AxiosRequestConfig {
    headers: AxiosRequestHeaders;
}

export const baseURL = 'http://localhost:8000/';

// Request Interceptor to add headers, including Authorization (if token is present)
const onRequest = (config: AdaptAxiosRequestConfig): AdaptAxiosRequestConfig => {
    config.headers.Accept = 'application/json';
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers.Pragma = 'no-cache';
    config.headers.Expires = '0';

    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
    } else {
        config.headers['Content-Type'] = 'application/json';  // Ensure this is being set
    }

    const userData = getUser();
    if (userData != null) {
        const accessToken = userData?.token;
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
}


// Error handling in case of request failure
const onError = async (error: AxiosError): Promise<AxiosError> =>
    await Promise.reject(error);

// Create an Axios instance with interceptors
export const axiosInstance: AxiosInstance = axios.create({
    baseURL,
});

// Attach interceptors to handle requests and responses
axiosInstance.interceptors.request.use(onRequest, onError);
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    onError
);
