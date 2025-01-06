import { getCookie } from 'cookies-next';
import { USER_DATA } from './constants';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUser = (): any => {
    const userData = getCookie(USER_DATA);

    if (userData && typeof userData === 'string') {
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error('Error parsing user data from cookie:', error);
            return null;
        }
    }
    return null;
};
