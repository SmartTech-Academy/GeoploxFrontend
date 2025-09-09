import { QueryClient } from '@tanstack/react-query';

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
      //   onError: (error, variables, context) => {
      //     console.error('Mutation error:', error);
      //     // You can add global error handling here
      //     // e.g., show toast notification, log to error service
      //   },
    },
  },
});

// // Optional: Add global error handler for uncaught query errors
// queryClient.setQueryDefaults(['*'], {
//   queryFn: async ({ queryKey, signal }) => {
//     // Global query function if needed
//     throw new Error('Query function must be provided');
//   },
// });

// Optional: Set up global mutation defaults for specific patterns
// queryClient.setMutationDefaults(['auth'], {
//   mutationFn: async (variables) => {
//     // Global auth mutation logic if needed
//     throw new Error('Mutation function must be provided');
//   },
//   onError: (error) => {
//     // Handle auth-specific errors
//     if (error?.status === 401) {
//       // Redirect to login or refresh token
//     }
//   },
// });

// // Development-only query debugging
// if (process.env.NODE_ENV === 'development') {
//   queryClient.setQueryDefaults(['*'], {
//     meta: {
//       errorBoundary: false, // Disable error boundaries in development for easier debugging
//     },
//   });
// }
