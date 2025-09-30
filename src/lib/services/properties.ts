import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';

export const useGetProperties = (params: any) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => api.get('/user/properties', { params }),
  });
};

export const useGetPropertyDetails = (slug: string) => {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: () => api.get(`/user/properties/${slug}`),
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
