import { useMutation, useQuery, UseMutationOptions } from '@tanstack/react-query';

import { toast } from 'sonner';
import { AxiosResponse } from 'axios';
import api from '../api';
import { queryClient } from '../queryClient';

interface ApiResponse {
  message: string;
}

export const useGetApprovals = (params?: any) => {
  return useQuery({
    queryKey: ['approvals', params],
    queryFn: () =>  api.get('/dashboard/admin/fetch/approvals', { params }),
  });
};

export const useVerifyUser = (options?: UseMutationOptions<any, any, string>) => {
  return useMutation({
    mutationFn: (userCodec: string) => {
      return api.put(`/dashboard/admin/verify?user_codec=${userCodec}`);
    },
    onSuccess: (response: AxiosResponse<ApiResponse>) => {
      toast.success(response.data.message || 'User verified successfully!');
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to verify user.');
    },
    ...options,
  });
};

export const useApproveRequest = (options?: UseMutationOptions<any, any, string>) => {
  return useMutation({
    mutationFn: (propertyId: string) => {
      const formData = new FormData();
      formData.append('property_id', propertyId);
      return api.put('/dashboard/admin/approver', formData);
    },
    onSuccess: (response: AxiosResponse<ApiResponse>) => {
      toast.success(response.data.message || 'Request approved successfully!');
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve request.');
    },
    ...options,
  });
};

export const useDeclineRequest = (options?: UseMutationOptions<any, any, { id: string; reason: string }>) => {
  return useMutation({
    mutationFn: (data: { id: string; reason: string }) => {
      const formData = new FormData();
      // This endpoint is not in Postman, assuming it takes a generic 'id' and 'reason'
      // It might need to be split like the approval endpoint if it has different routes/params
      formData.append('id', data.id);
      formData.append('reason', data.reason);
      // NOTE: The endpoint '/dashboard/admin/decline' is assumed. Please update if it's different.
      return api.put('/dashboard/admin/decline', formData);
    },
    onSuccess: (response: AxiosResponse<ApiResponse>) => {
      toast.success(response.data.message || 'Request declined successfully!');
      queryClient.invalidateQueries({ queryKey: ['approvals'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to decline request.');
    },
    ...options,
  });
};
