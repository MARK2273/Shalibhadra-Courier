import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Service {
  id: string;
  name: string;
}

export const getServices = async (): Promise<Service[]> => {
  const response = await api.get('/services');
  return response.data;
};

export const getShipmentById = async (id: string): Promise<any> => {
  const response = await api.get(`/form/${id}`);
  return response.data;
};

export const updateShipment = async (id: string, data: any): Promise<void> => {
  await api.put(`/form/${id}`, data);
};

export const deleteShipment = async (id: string): Promise<void> => {
  await api.delete(`/form/${id}`);
};

export const trackShipment = async (awb: string, tenant?: string): Promise<any> => {
  const response = await api.get(`/public/track/${awb}${tenant ? `?tenant=${tenant}` : ''}`);
  return response.data;
};

export const getHsCodes = async (): Promise<any[]> => {
  const response = await api.get('/public/hs-codes');
  return response.data;
};

export default api;
