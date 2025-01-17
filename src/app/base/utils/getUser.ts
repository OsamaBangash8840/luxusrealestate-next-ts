import { getCookie } from 'cookies-next';
import { USER_DATA } from './constants';

export const getUser = () => {
  const userData = getCookie(USER_DATA);

  if (userData && typeof userData === 'string') {
    try {
      return JSON.parse(userData); // Parse JSON if valid
    } catch (error) {
      console.warn('Error parsing user data from cookie:', error);
      return null; // Return null if the data isn't valid JSON
    }
  }
  return null; // Return null if no cookie is found
};
