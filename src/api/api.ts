import axios from 'axios';
import { type UpiConfig } from '../types/shipment';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
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
);

// Add a response interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Service {
  id: string;
  name: string;
}

export type { UpiConfig };

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

export const updatePaymentStatus = async (id: string, status: 'Paid' | 'Pending'): Promise<void> => {
  await api.patch(`/form/${id}/status`, { status });
};


export const trackShipment = async (awb: string, tenant?: string): Promise<any> => {
  const response = await api.get(`/public/track/${awb}${tenant ? `?tenant=${tenant}` : ''}`);
  return response.data;
};

export const getHsCodes = async (): Promise<any[]> => {
  const response = await api.get('/public/hs-codes');
  return response.data;
};

export const getUpiConfigs = async (): Promise<{ configs: any[], defaultUpiId: string | null }> => {
  const response = await api.get('/form/upi-configs');
  return response.data;
};

export const uploadPdf = async (id: string, pdfBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('pdf', pdfBlob, `shipment_${id}.pdf`);
  const response = await api.post(`/form/upload-pdf/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.redirectUrl;
};

export default api;
