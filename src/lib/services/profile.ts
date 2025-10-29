import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../api';
// import { queryClient } from "../queryClient";
import { UserProfile } from '../types';
import { AxiosResponse } from 'axios';
import { queryClient } from '../queryClient';

interface ProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
}

interface Payment {
  id: string;
  plan_name: string;
  amount: number;
  currency: string;
  paid_at: string;
}

interface BillingData {
  currentPlan: any;
  payments: Payment[];
  summary: {
    next_renewal: string;
  };
}

interface BillingResponse {
  status: string;
  message: string;
  data: BillingData;
}

export const useGetBillingInfo = () => {
  return useQuery<BillingData>({
    queryKey: ['billing-info'],
    queryFn: async () => {
      const response: AxiosResponse<BillingResponse> = await api.get('/dashboard/billing/subscriptions');
      return response.data.data;
    },
    retry: false,
  });
}

export const useGetProfileData = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserProfile> => {
      const response: AxiosResponse<ProfileResponse> = await api.get('/dashboard/profile-datas');
      return response.data.data;
    },
    retry: false, // Optional: prevent retrying on auth errors
  });
};


export const useUpdatePersonalInformation = () => {
  return useMutation({
    mutationFn: (data: any) => {
      const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
      const imageType = data instanceof FormData ? 'file' : 'binary';
      const url = `/dashboard/profile-settings/update-personal-info?dimension=300by300&edit_image=resize-only&image_type=${imageType}`;



      return api.put(url, data, {
        headers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useAdminVerifyUser = () => {
  return useMutation({
    mutationFn: (user_codec: string) => api.put(`/dashboard/admin-verify?user_codec=${user_codec}`),
  });
};

export const useUpdateBusinessInformation = () => {
  return useMutation({
    mutationFn: (data: any) => {
          const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
      // If base64_file is present, we are sending a binary (base64) image.
      // Otherwise, no image is being updated.
      const imageType = data.base64_file ? 'binary' : 'file';
      const url = `/dashboard/profile-settings/update-business-info?dimension=300by300&edit_image=resize-only&image_type=${imageType}`;

      return api.put(url, data, {
        headers,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: any) => {
      const url = `/dashboard/profile-settings/change-password`;

      // The API expects `current_password` and `new_password`.
      // We are sending the data as a JSON object.
      const payload = {
        current_password: data.current_password,
        new_password: data.new_password,
      };

      return api.post(url, payload);
    },
    onSuccess: () => {
      // Optionally, you can add success logic here, like showing a toast notification.
    },
  });
};
