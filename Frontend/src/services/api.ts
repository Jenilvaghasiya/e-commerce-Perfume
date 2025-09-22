// Simple API client for the frontend
// Base URL priority: Vite env -> default localhost:3000

const API_URL: string = (import.meta as any)?.env?.VITE_API_URL || 'https://e-commerce-perfume.onrender.com';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, options: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;
  const resp = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const message = (data as any)?.message || `Request failed with status ${resp.status}`;
    throw new Error(message);
  }
  return data as T;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function authSignin(payload: { email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/signin', { method: 'POST', body: payload });
}

export async function authSignup(payload: { name: string; email: string; password: string }): Promise<AuthResponse> {
  return request<AuthResponse>('/api/auth/signup', { method: 'POST', body: payload });
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token?: string) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

// Attach auth header from localStorage token
export function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// Product types
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Men' | 'Women' | 'Unisex' | string;
  inStock: boolean;
  featured: boolean;
  brand?: string;
  rating?: number;
  reviews?: number;
  notes?: { top?: string[]; middle?: string[]; base?: string[] };
}

// Product APIs
export function getProducts(): Promise<Product[]> {
  return request<Product[]>('/api/products', { method: 'GET' });
}

export function createProduct(payload: Omit<Product, '_id'>): Promise<Product> {
  return request<Product>('/api/products', { method: 'POST', body: payload, headers: authHeaders() });
}

export function updateProductApi(id: string, updates: Partial<Product>): Promise<Product> {
  return request<Product>(`/api/products/${id}`, { method: 'PUT', body: updates, headers: authHeaders() });
}

export function deleteProductApi(id: string): Promise<{ message: string }> {
  return request<{ message: string }>(`/api/products/${id}`, { method: 'DELETE', headers: authHeaders() });
}

// Orders
export interface OrderItemPayload {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  customNotes?: { top?: string; middle?: string; base?: string };
}

export interface CreateOrderPayload {
  email: string;
  items: OrderItemPayload[];
  total: number;
  status?: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
  };
  paymentMethod: 'card' | 'online' | 'cod';
  paymentStatus?: 'Pending' | 'Paid' | 'Failed';
}

export interface OrderResponse {
  _id: string;
  userId: string;
  email: string;
  items: OrderItemPayload[];
  total: number;
  status: string;
  shippingAddress: CreateOrderPayload['shippingAddress'];
  paymentMethod: string;
  paymentStatus: string;
  orderNumber: string;
  trackingNumber?: string;
  createdAt: string;
}

export function createOrder(payload: CreateOrderPayload): Promise<OrderResponse> {
  return request<OrderResponse>('/api/orders', { method: 'POST', body: payload, headers: authHeaders() });
}

export function getMyOrders(): Promise<OrderResponse[]> {
  return request<OrderResponse[]>('/api/orders/me', { method: 'GET', headers: authHeaders() });
}

export function getAllOrders(): Promise<OrderResponse[]> {
  return request<OrderResponse[]>('/api/orders', { method: 'GET', headers: authHeaders() });
}

export function updateOrderStatusApi(id: string, status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'): Promise<OrderResponse> {
  return request<OrderResponse>(`/api/orders/${id}/status`, { method: 'PUT', body: { status }, headers: authHeaders() });
}

// Customizations
export interface CustomizationNote {
  id: string;
  name: string;
  category: 'top' | 'middle' | 'base';
  intensity?: number;
  price?: number;
}

export interface CreateCustomizationPayload {
  name: string;
  notes: { top: CustomizationNote[]; middle: CustomizationNote[]; base: CustomizationNote[] };
  concentration: number;
  bottleSize: number;
  totalPrice: number;
}

export interface CustomizationResponse extends CreateCustomizationPayload {
  _id: string;
  userId: string;
  createdAt?: string;
}

export function createCustomization(payload: CreateCustomizationPayload): Promise<CustomizationResponse> {
  return request<CustomizationResponse>('/api/customizations', { method: 'POST', body: payload, headers: authHeaders() });
}

export function getMyCustomizations(): Promise<CustomizationResponse[]> {
  return request<CustomizationResponse[]>('/api/customizations/me', { method: 'GET', headers: authHeaders() });
}

export function getAllCustomizationsAdmin(): Promise<CustomizationResponse[]> {
  return request<CustomizationResponse[]>('/api/admin/customizations', { method: 'GET', headers: authHeaders() });
}

// Admin APIs
export interface AdminStatsResponse {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export function getAdminStats(): Promise<AdminStatsResponse> {
  return request<AdminStatsResponse>('/api/admin/stats', { method: 'GET', headers: authHeaders() });
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | string;
  createdAt?: string;
}

export function getAllUsers(): Promise<AdminUser[]> {
  return request<AdminUser[]>('/api/admin/users', { method: 'GET', headers: authHeaders() });
}

