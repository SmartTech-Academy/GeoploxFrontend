import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api';
import { queryClient } from '../queryClient';
import { toast } from 'sonner';

export const useGetProperties = (params?: any, isDashboard?: boolean, isAdminListing?: boolean) => {
  const endpoint = isAdminListing
    ? '/user/properties'
    : isDashboard
      ? '/dashboard/properties'
      : '/user/properties';
  return useQuery({
    queryKey: ['properties', params, isDashboard, isAdminListing, endpoint],
    queryFn: () => api.get(endpoint, { params }),
  });
};


export const useGetPropertyDetails = (identifier: string, isDashboard?: boolean) => {
  const endpoint = isDashboard
    ? location.pathname.includes('/admin-listing/')
      ? `/dashboard/admin/fetch-property/${identifier}`
      : `/dashboard/fetch-property/${identifier}`
    : `/user/properties/${identifier}`;
  return useQuery({
    queryKey: ['property', identifier, isDashboard, endpoint],
    queryFn: () => api.get(endpoint), // Pass identifier to queryFn
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
      return api.put(`/dashboard/update/property/${propertyId}`, data);
    },
  });
};

export const useFlagProperty = () => {
  return useMutation({
    mutationFn: (propertyId: string) => api.put(`/dashboard/admin/flag-property/${propertyId}`),
    onSuccess: (_, propertyId) => {
      toast.success('Property flagged successfully!');
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] }); // Invalidate specific property
    },
  });
};

export const useRevokeUserVerification = () => {
  return useMutation({
    mutationFn: (userCodec: string) => {
      const formData = new FormData();
      formData.append('user_codec', userCodec);
      return api.post('/dashboard/admin/revoke/user-verification', formData);
    },
  });
};

export const useBlacklistUser = () => {
  return useMutation({
    mutationFn: (userCodec: string) =>
      api.post('/dashboard/admin/blacklist/user', { user_codec: userCodec }),
  });
};

export const useArchiveProperty = () => {
  return useMutation({
    mutationFn: ({ propertyId, action }: { propertyId: string; action: 'archive' | 'restore' }) => {
      const formData = new FormData();
      formData.append('action', action);
      return api.post(`/dashboard/property/${propertyId}/archive`, formData);
    },
    onSuccess: () => {
      toast .success('Property status updated!');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

export const useDeleteProperty = () => {
  return useMutation({
    mutationFn: (propertyId: string) => api.delete(`/dashboard/property/${propertyId}/delete`),
    onSuccess: (data) => {
      toast.success(data.data.message || 'Property deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};
