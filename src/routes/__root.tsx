import { createRootRoute } from '@tanstack/react-router';
import RootLayout from '@/components/layouts/RootLayout';
import { ErrorBoundaryFallback, NotFoundPage } from '@/components/error-components';

export const Route = createRootRoute({
  component: RootLayout,
  errorComponent: ({ error }) => (
    <ErrorBoundaryFallback error={error} resetErrorBoundary={() => window.location.reload()} />
  ),
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#000000' },
    ],
    links: [
      { rel: 'icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    ],
  }),
});
