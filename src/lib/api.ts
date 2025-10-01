import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { queryClient } from './queryClient';

const BASE_URL = 'https://geoplox.ribiax.com/api/v1';
 const publicPages = [
      '/buy',
      '/rent',
      '/sell',
      '/blog',
      '/pricing',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/verify-email',
      '/about',
      '/contact-us',
    ];

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: any) => {
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError | Error> => {
  if (error.response) {
    const { status } = error.response;


    if (status === 401) {
      localStorage.removeItem('token');
      queryClient.clear();
      const isPublicPage = publicPages.includes(window.location.pathname);
      const isHomePage = window.location.pathname === '/';

      // Redirect only if it's NOT a public page AND NOT the home page
      if (!isPublicPage && !isHomePage) {
        window.location.href = '/login';
      }

      return Promise.reject(new Error('Your session has expired. Please log in again.'));
    }

    if (status === 403) {
      return Promise.reject(new Error('Access forbidden. You do not have permission to perform this action.'));
    }

    if (status === 413) {
      return Promise.reject(new Error('The file you uploaded is too large. Please upload a smaller file.'));
    }

    if (status === 504) {
      return Promise.reject(new Error('Request timed out. Please try again or check your connection.'));
    }

    if (status >= 500) {
      return Promise.reject(new Error('Sorry, a server error occurred. Please try again later.'));
    }
  } else if (error.request) {
    // The request was made but no response was received
    return Promise.reject(new Error('No response from server. Please check your network connection.'));
  }
  return Promise.reject(error);
};

api.interceptors.request.use(onRequest, onRequestError);
api.interceptors.response.use(onResponse, onResponseError);

export default api;
