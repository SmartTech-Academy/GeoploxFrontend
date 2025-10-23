import { useQuery } from '@tanstack/react-query';
import api from '../api';

export const useGetDashboardOverview = (period: string) => {
  return useQuery({
    queryKey: ['dashboardOverview', period],
    queryFn: () => api.get('/dashboard/overview', { params: { period } }),
  });
};

interface PerformanceParams {
  period: string;
  filter: string;
}

export const useGetPerformance = (params: PerformanceParams) => {
  return useQuery({
    queryKey: ['performance', params],
    queryFn: () => api.get('/dashboard/performance', { params }),
  });
};
