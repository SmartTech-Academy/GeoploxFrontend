import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';

export const useGetProperties = (params?: any) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => api.get('/dashboard/properties', { params }),
  });
};

export const useGetPropertyDetails = (slug: string) => {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => api.get(`/user/properties/${slug}`),
  });
};

export const useGetDashboardPropertyDetails = (id: string) => {
  return useQuery({
    queryKey: ['dashboard-property', id],
    queryFn: () => api.get(`/dashboard/fetch-property/${id}`),
    enabled: !!id,
  });
};

export const useGetRelatedProperties = (slug: string) => {
  return useQuery({
    queryKey: ['related-properties', slug],
    queryFn: () => api.get(`/user/properties/related/${slug}`),
  });
};

export const useGetPropertyCategories = () => {
  return useQuery({
    queryKey: ['property-categories'],
    queryFn: () => api.get('/user/properties/categories'),
  });
};

export const useGetPropertyTags = () => {
  return useQuery({
    queryKey: ['property-tags'],
    queryFn: () => api.get('/user/properties/tags'),
  });
};

export const useContactPropertyOwner = () => {
  return useMutation({
    mutationFn: ({ propertyId, data }: { propertyId: string; data: any }) =>
      api.post(`/dashboard/contact/property-owner/${propertyId}`, data),
  });
};

export const useUploadPropertyImage = () => {
  return useMutation({
    mutationFn: (data: FormData) =>
      api.post('/dashboard/upload/property-image', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  });
};

export const useUploadPropertyDocument = () => {
  return useMutation({
    mutationFn: (data: FormData) =>
      api.post('/dashboard/upload/property-doc', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  });
};

export const useUploadProofOfAddress = () => {
  return useMutation({
    mutationFn: (data: FormData) =>
      api.post('/dashboard/upload/prove-of-address', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  });
};

export const useCreateProperty = () => {
  return useMutation({
    mutationFn: (data: any) => api.post('/dashboard/create/property', data),
  });
};

export const useUpdateProperty = (propertyId: string) => {
  return useMutation({
    mutationFn: (data: any) => {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      formData.append('_method', 'PUT');
      return api.post(`/dashboard/update/property/${propertyId}`, formData);
    },
  });
};
