// API Configuration and Helper Functions
import authService from './services/authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/teaching';

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Generic fetch wrapper with error handling and auth
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get valid token from auth service (auto-refreshes if needed)
  const token = await authService.getValidToken();
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add Authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      await authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      throw new ApiError('Unauthorized - please login again', 401);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    const data: ApiResponse<T> = await response.json();
    
    // Handle API response format
    if (!data.success) {
      throw new ApiError(data.message || 'API request failed', response.status, data);
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// Fetch wrapper for FormData (multipart/form-data) - doesn't set Content-Type header
async function fetchApiFormData<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get valid token from auth service (auto-refreshes if needed)
  const token = await authService.getValidToken();
  
  const headers: HeadersInit = {};
  // Don't set Content-Type - browser will set it with boundary for FormData

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized - redirect to login
    if (response.status === 401) {
      await authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/signin';
      }
      throw new ApiError('Unauthorized - please login again', 401);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP Error: ${response.status}`,
        response.status,
        errorData
      );
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return {} as T;
    }

    const data: ApiResponse<T> = await response.json();
    
    // Handle API response format
    if (!data.success) {
      throw new ApiError(data.message || 'API request failed', response.status, data);
    }

    return data.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
}

// API Methods
export const api = {
  // GET request
  get: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'GET' }),

  // POST request
  post: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // POST request with FormData (multipart/form-data)
  postFormData: <T>(endpoint: string, formData: FormData, options?: RequestInit) =>
    fetchApiFormData<T>(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
    }),

  // PUT request
  put: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // PUT request with FormData (multipart/form-data)
  putFormData: <T>(endpoint: string, formData: FormData, options?: RequestInit) =>
    fetchApiFormData<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: formData,
    }),

  // PATCH request
  patch: <T>(endpoint: string, data?: any, options?: RequestInit) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  // DELETE request
  delete: <T>(endpoint: string, options?: RequestInit) =>
    fetchApi<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Auth helper functions
export { default as authService } from './services/authService';

export default api;
