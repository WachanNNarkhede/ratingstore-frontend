export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: 'ADMIN' | 'NORMAL_USER' | 'STORE_OWNER';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: number;
  userRating?: number;
  totalRatings: number;
}

export interface StoreDetails extends Store {
  ratings: Rating[];
  owner: {
    name: string;
    email: string;
  };
}

export interface Rating {
  id: string;
  rating: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email?: string;
  };
  store?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors?: any[];
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UserWithStore {
  id: string;
  name: string;
  email: string;
  address: string;
  role: string;
  createdAt: string;
  averageRating?: number;
  store?: {
    id: string;
    name: string;
  };
}