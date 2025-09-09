import React from 'react';

import { Button } from './ui/button';
import { Link, useRouter } from '@tanstack/react-router';
import LoadingFallback from './loading-fallback';

// NotFoundPage Component
const NotFoundPage = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mt-4">404 - Page Not Found</div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => {
              router.history.back();
            }}
            className="border-primary mt-8 h-11 gap-11 rounded-full border px-5 py-2.5 text-[16px] leading-[16px] font-medium tracking-[-0.02em] text-white"
          >
            Go Back
          </Button>

          <Button
            asChild
            className="border-primary mt-8 h-11 gap-11 rounded-full border px-5 py-2.5 text-[16px] leading-[16px] font-medium tracking-[-0.02em] text-white"
          >
            <Link viewTransition to="/">
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

// ErrorPage Component
interface ErrorPageProps {
  error: unknown;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ error }) => {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === 'development';

  // Get error from the current route match

  const errorMessage = error instanceof Error ? error?.message : 'Unknown error occurred';

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="max-w-lg px-4 text-center">
        <div className="mx-auto h-24 w-24">
          <svg viewBox="0 0 24 24" className="h-full w-full text-indigo-600">
            <circle cx="12" cy="12" r="11" className="fill-current opacity-20" />
            <path
              className="fill-current"
              d="M12 8v5M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Something went wrong</h1>
        <p className="mt-4 text-gray-600">
          {isDev ? errorMessage : 'An unexpected error occurred. Please try again later.'}
        </p>
        {isDev && error instanceof Error && error.stack && (
          <div className="mt-6 rounded-lg bg-gray-100 p-4 text-left">
            <p className="font-mono text-sm whitespace-pre-wrap text-gray-800">{error.stack}</p>
          </div>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={() => window.location.reload()}
            className="border-primary h-11 gap-11 rounded-full border px-5 py-2.5 text-[16px] leading-[16px] font-medium tracking-[-0.02em] text-white"
          >
            Try Again
          </Button>
          <Button
            onClick={() => router.history.back()}
            variant="outline"
            className="border-primary h-11 gap-11 rounded-full border px-5 py-2.5 text-[16px] leading-[16px] font-medium tracking-[-0.02em]"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

// Global Error Boundary Component
interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({ error, resetErrorBoundary }) => {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <div className="max-w-lg px-4 text-center">
        <div className="mx-auto h-24 w-24">
          <svg viewBox="0 0 24 24" className="h-full w-full text-red-600">
            <circle cx="12" cy="12" r="11" className="fill-current opacity-20" />
            <path
              className="fill-current"
              d="M12 8v5M12 16h.01"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Application Error</h1>
        <p className="mt-4 text-gray-600">
          {isDev ? error.message : 'The application encountered an unexpected error.'}
        </p>
        {isDev && error.stack && (
          <div className="mt-6 max-h-64 overflow-auto rounded-lg bg-red-100 p-4 text-left">
            <p className="font-mono text-sm whitespace-pre-wrap text-red-800">{error.stack}</p>
          </div>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <Button
            onClick={resetErrorBoundary}
            className="border-primary h-11 gap-11 rounded-full border px-5 py-2.5 text-[16px] leading-[16px] font-medium tracking-[-0.02em] text-white"
          >
            Try Again
          </Button>
          <Button
            onClick={() => (window.location.href = '/dashboard')}
            variant="outline"
            className="border-primary h-11 gap-11 rounded-full border px-5 py-2.5 text-[16px] leading-[16px] font-medium tracking-[-0.02em]"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

// Loader Component - Mind-blowing design
const Loader = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative flex flex-col items-center">
        {/* Main loader container with multiple spinning elements */}
        <div className="relative h-32 w-32">
          {/* Outer ring with gradient */}
          <div className="from-primary via-primary/60 to-primary/30 before:from-primary before:via-primary/60 before:to-primary/30 absolute inset-0 h-32 w-32 animate-spin rounded-full border-4 border-transparent bg-gradient-to-r [background-clip:padding-box] before:absolute before:inset-[-4px] before:rounded-full before:bg-gradient-to-r before:opacity-70 before:blur-sm before:content-['']"></div>

          {/* Middle ring - counter rotating */}
          <div className="from-primary/80 via-primary/40 absolute inset-4 h-24 w-24 animate-spin rounded-full border-4 border-transparent bg-gradient-to-l to-transparent [animation-direction:reverse] [animation-duration:1.5s]"></div>

          {/* Inner pulsing core */}
          <div className="from-primary to-primary/70 shadow-primary/30 absolute inset-8 h-16 w-16 animate-pulse rounded-full bg-gradient-to-br shadow-2xl"></div>

          {/* Floating dots around the loader */}
          <div className="bg-primary absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-4 transform animate-bounce rounded-full [animation-delay:-0.5s]"></div>
          <div className="bg-primary absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-4 transform animate-bounce rounded-full [animation-delay:-0.3s]"></div>
          <div className="bg-primary absolute top-1/2 right-0 h-2 w-2 translate-x-4 -translate-y-1/2 transform animate-bounce rounded-full [animation-delay:-0.7s]"></div>
          <div className="bg-primary absolute top-1/2 left-0 h-2 w-2 -translate-x-4 -translate-y-1/2 transform animate-bounce rounded-full [animation-delay:-0.1s]"></div>
        </div>

        {/* Particle effects */}
        <div className="pointer-events-none absolute inset-0 h-full w-full">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={`bg-primary/40 absolute h-1 w-1 animate-ping rounded-full`}
              style={{
                top: `${30 + Math.sin(i * 0.785) * 20}%`,
                left: `${50 + Math.cos(i * 0.785) * 20}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>

        {/* Glowing text with typewriter effect */}
        <div className="relative mt-12">
          <div className="from-primary to-primary/70 absolute inset-0 bg-gradient-to-r bg-clip-text text-transparent blur-sm">
            <p className="text-xl font-bold tracking-wider">LOADING</p>
          </div>
          <p className="from-primary to-primary/70 relative animate-pulse bg-gradient-to-r bg-clip-text text-xl font-bold tracking-wider text-transparent">
            LOADING
          </p>

          {/* Animated dots */}
          <div className="mt-2 flex justify-center space-x-1">
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0s]"></div>
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.2s]"></div>
            <div className="bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:0.4s]"></div>
          </div>
        </div>

        {/* Subtle progress indication */}
        <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-gray-200">
          <div className="from-primary via-primary/80 to-primary h-full animate-pulse rounded-full bg-gradient-to-r bg-[length:200%_100%]"></div>
        </div>
      </div>
    </div>
  );
};

// WithSuspense HOC
interface WithSuspenseProps {
  children?: React.ReactNode;
}

const WithSuspense = (Component: React.ComponentType<any>) => {
  return function WithSuspenseWrapper(props: WithSuspenseProps) {
    return (
      <React.Suspense fallback={<LoadingFallback />}>
        <Component {...props} />
      </React.Suspense>
    );
  };
};

export { NotFoundPage, ErrorPage, Loader, WithSuspense, ErrorBoundaryFallback };
