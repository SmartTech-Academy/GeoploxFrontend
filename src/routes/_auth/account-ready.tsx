import assets from '@/assets';
import { PageMetaTags } from '@/components/page-meta-data';
import { Button } from '@/components/ui/button';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';

type AccountReadySearch = {
  email: string;
};

export const Route = createFileRoute('/_auth/account-ready')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): AccountReadySearch => ({
    email: (search.email as string) || 'your.email@example.com',
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { email } = useSearch({ from: '/_auth/account-ready' });

  const handleLoginToDashboard = () => {
    // In a real app, this would navigate to the dashboard
    navigate({ to: '/getting-started' });
  };

  return (
    <div className="flex size-full min-h-screen  flex-col justify-between self-stretch py-10">
      <PageMetaTags
        title="Account Successfully Created"
        description="Welcome to Geoplox! Your account is ready. Start exploring properties or list your own."
        keywords="account created, welcome to geoplox"
      />
      {/* Header */}
      <div className="flex w-full items-center justify-between gap-6 px-4 lg:px-12">
        <img src={assets.logotext} alt="logo" className="h-[46px] w-[126px]" width={126} height={46} />
        <span className="inline-flex gap-1 text-[14px] leading-[21px] text-[#41415A]">
          Have an Account?{' '}
          <a href="/login" className="font-semibold text-[#D4AF36] hover:underline">
            Sign In{' '}
          </a>
        </span>
      </div>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-10 px-4 lg:px-0">
        {/* Success Illustration */}
        <img src={assets.accountset} className="size-[134px]" width={134} height={134} alt="" />

        {/* Success Message */}
        <div className="flex w-full flex-col items-center gap-4 self-stretch text-center">
          <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Your account is ready</h1>
          <p className="text-[14px]/5  text-[#71748C]">
            You will be able to login with your email address
            <br />
            <span className="font-medium">({email || 'your.email@example.com'})</span>
          </p>
        </div>

        {/* Login Button */}
        <div className="flex w-full flex-col items-start gap-7 self-stretch">
          <Button
            onClick={handleLoginToDashboard}
            style={{
              background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
              boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            Login to Dashboard
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-[14px]/5  text-[#41415A]">
          © {new Date().getFullYear()} — Geoplox, All Right Reserved.
        </p>
      </div>
    </div>
  );
}
