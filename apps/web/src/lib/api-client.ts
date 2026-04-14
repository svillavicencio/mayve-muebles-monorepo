const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000';

export interface SiteConfig {
  id: string;
  whatsapp: string;
  email: string;
  cashDiscount: number;
  announcementBanner?: string | null;
  instagramUrl: string;
  address: string;
  googleMapsUrl: string;
}

export async function fetchProducts<T>(params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API_BASE_URL}/products`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
  }
  const response = await fetch(url.toString(), { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Error fetching products: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchProduct<T>(slug: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Error fetching product ${slug}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchCategories<T = unknown>(): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/categories`, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Error fetching categories: ${response.statusText}`);
  }
  return response.json();
}

export async function createProduct<T>(data: any): Promise<T> {
  const isFormData = data instanceof FormData;
  
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Error creating product: ${response.statusText}`);
  }
  return response.json();
}

export async function updateProduct<T>(id: string, data: any): Promise<T> {
  const isFormData = data instanceof FormData;

  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: isFormData ? data : JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Error updating product: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Error deleting product: ${response.statusText}`);
  }
}

export async function createCategory<T>(data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Error creating category: ${response.statusText}`);
  }
  return response.json();
}

export async function deleteCategory(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: response.statusText }));
    const err = new Error(body.message || `Error deleting category: ${response.statusText}`);
    (err as any).status = response.status;
    throw err;
  }
}

export async function fetchSiteConfig<T = unknown>(): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/site-config`, { credentials: 'include' });
  if (!response.ok) {
    throw new Error(`Error fetching site configuration: ${response.statusText}`);
  }
  return response.json();
}

export async function updateSiteConfig<T>(data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/site-config`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Error updating site configuration: ${response.statusText}`);
  }
  return response.json();
}

export async function login<T = unknown>(email: string, password: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Login failed: ${response.statusText}`);
  }

  return response.json();
}
