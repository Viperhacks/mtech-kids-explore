
import api from '@/lib/api';

// Example service functions
export const fetchData = async (endpoint: string) => {
  try {
    const response = await api.get(`/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await api.post(`/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
