import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const useGetPlatformPerformance = (params: { period: string; filter: string }) => {
  return useQuery({
    queryKey: ['platform-performance', params],
    queryFn: () => api.get('/admin/platform/performance/', { params }),
  });
};
