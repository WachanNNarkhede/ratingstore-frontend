import axios from 'axios';
import { type AuthResponse, type User, type Store, type StoreDetails, type Rating, type DashboardStats, type UserWithStore } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  updatePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Store API
export const storeAPI = {
  getStores: async (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ stores: Store[] }> => {
    const response = await api.get('/stores', { params });
    return response.data;
  },

  getStoreDetails: async (id: string): Promise<{ store: StoreDetails }> => {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  },

  getMyStore: async (): Promise<{ store: StoreDetails }> => {
    const response = await api.get('/stores/my-store');
    return response.data;
  },

  createStore: async (storeData: {
    name: string;
    email: string;
    address: string;
    ownerEmail: string;
  }) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  },
};

// Rating API
export const ratingAPI = {
  submitRating: async (ratingData: {
    storeId: string;
    rating: number;
  }) => {
    const response = await api.post('/ratings', ratingData);
    return response.data;
  },

  getUserRatings: async (): Promise<{ ratings: Rating[] }> => {
    const response = await api.get('/ratings/my-ratings');
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getDashboardStats: async (): Promise<{ stats: DashboardStats }> => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getUsers: async (params?: {
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<{ users: UserWithStore[]; pagination: any }> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    address: string;
    role?: string;
  }) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  getAllStores: async (params?: {
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    limit?: number;
  }): Promise<{ stores: any[]; pagination: any }> => {
    const response = await api.get('/admin/stores', { params });
    return response.data;
  },
};

export default api;