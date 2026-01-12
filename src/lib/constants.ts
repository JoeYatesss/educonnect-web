/**
 * Centralized application constants
 */

// API Configuration - ensure HTTPS in production
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Force HTTPS for non-localhost URLs (production)
export const API_URL = rawApiUrl.includes('localhost')
  ? rawApiUrl
  : rawApiUrl.replace('http://', 'https://');

// API endpoint helpers
export const apiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};
