import { useQuery } from '@tanstack/react-query';
import api from '../api';
// import { queryClient } from "../queryClient";
import { UserProfile } from '../types';
import { AxiosResponse } from 'axios';

interface ProfileResponse {
  status: string;
  message: string;
  data: UserProfile;
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
