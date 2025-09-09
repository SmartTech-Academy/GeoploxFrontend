import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

import assets from '@/assets';
import { PageMetaTags } from '@/components/page-meta-data';

export const Route = createFileRoute('/_auth/password-reset-sent')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search.email as string) || '',
  }),
});

function RouteComponent() {
  const { email } = useSearch({ from: '/_auth/password-reset-sent' });
  console.log('Email from search:', email);

  return (
    <div className="flex h-full w-full bg-white">
      <PageMetaTags
        title="Password Reset Link Sent"
        description="We've sent a password reset link to your email. Check your inbox to continue."
        keywords="password reset confirmation"
      />
      <div className="flex h-full min-h-screen w-full flex-col justify-between self-stretch py-10">
        {/* Header */}
        <div className="flex w-full items-center justify-between gap-6 px-4 lg:px-12">
          <Link to="/">
            <img src={assets.logotext} alt="logo" className="h-[46px] w-[126px]" width={126} height={46} />
          </Link>

          <span className="inline-flex gap-1 text-[14px] leading-[21px] text-[#41415A]">
            Have an Account?{' '}
            <Link to="/login" className="font-semibold text-[#D4AF36] hover:underline">
              Sign In
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-10 px-4 lg:px-0">
          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#D4AF36]/10">
            <Mail className="h-10 w-10 text-[#D4AF36]" />
          </div>

          <div className="flex w-full flex-col items-center gap-4 self-stretch">
            <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Password Recovery link sent</h1>
            <p className="max-w-[400px] text-center text-[14px] leading-[20px] text-[#71748C]">
              If your email address provided is associated with an account, you should receive a link to create a new
              password
            </p>
          </div>

          <div className="flex w-full flex-col gap-4">
            <Button
              onClick={() => (window.location.href = '/login')}
              style={{
                background: '#E5E5E5',
              }}
              className="h-10 w-full rounded-[40px] p-4 text-[14px] leading-[17px] font-semibold text-[#1F2130] hover:bg-gray-300"
            >
              Done
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[14px] leading-[20px] text-[#41415A]">© 2025 — Geoplox, All Right Reserved.</p>
        </div>
      </div>
    </div>
  );
}
