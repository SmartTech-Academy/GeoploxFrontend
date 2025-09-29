import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry configuration
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        // Check if error has a status property (e.g., AxiosError or custom error)
        if (typeof error === 'object' && error !== null && 'status' in error) {
          const status = (error as { status?: number }).status;
          if (typeof status === 'number' && status >= 400 && status < 500) {
            return false;
          }
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },

      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff

      // Refetch behavior
      refetchOnWindowFocus: false,
      refetchOnReconnect: true, // Refetch when network reconnects
      refetchOnMount: true, // Refetch when component mounts

      // Cache timing
      staleTime: 1000 * 60 * 5, // 5 minutes - data considered fresh
      gcTime: 1000 * 60 * 30, // 30 minutes - cache garbage collection (formerly cacheTime)

      // Network and error handling
      networkMode: 'online', // Only run queries when online

      // Performance
      structuralSharing: true, // Optimize re-renders by sharing unchanged data structures

      // Suspense (if using React Suspense)
      // throwOnError: false, // Set to true if using error boundaries exclusively
    },

    mutations: {
      // Retry mutations only once by default
      retry: 1,
      retryDelay: 1000,

      // Network behavior for mutations
      networkMode: 'online',

      // Global mutation error handling
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message || 'An error occurred';
        const toastId = toast.error('An error occurred', {
          description: errorMessage,
          action: {
            label: 'Dismiss',
            onClick: () => toast.dismiss(toastId), // dismisses the toast
          },
        });
      },
    },
  },
});
