import axios from 'axios';
import { toast } from 'sonner';

let api = axios.create({ baseURL: 'http://localhost:8080/api' }); 

export async function createApiInstance() {
  try {
    const config = await (window as any).electron?.getConfig?.();
    api = axios.create({
      baseURL: config?.apiBaseUrl || 'http://localhost:8080/api',
      headers: { 'Content-Type': 'application/json' },
    });

    // Setup interceptors
    api.interceptors.request.use((config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    api.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          toast("Oops! Your session timed out. Let’s log you back in to keep learning!", { duration: 4000 });
          setTimeout(() => {
            window.location.href = '/?auth=expired';
          }, 2000);
          return new Promise(() => {}); // hang promise
        }
        return Promise.reject(error.response?.data || error);
      }
    );

  } catch (error) {
    console.warn('Failed to load Electron config, using fallback baseURL', error);
  }
}

createApiInstance();


export function getApi() {
  return api;
}
