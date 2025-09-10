import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import * as z from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

import assets from '@/assets';
import { Link } from '@tanstack/react-router';
import { customResolver } from '@/lib/customZodResolver';
import { PageMetaTags } from '@/components/page-meta-data';

// Zod schema for OTP verification
const otpSchema = z.object({
  otp: z.string().min(6, 'Please enter the complete 6-digit code').max(6, 'Code must be exactly 6 digits'),
});

type OTPFormValues = z.infer<typeof otpSchema>;

// Search params type
type VerifyOTPSearch = {
  phone?: string;
};

export const Route = createFileRoute('/_auth/verify-otp')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): VerifyOTPSearch => {
    return {
      phone: typeof search.phone === 'string' ? search.phone : undefined,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { phone } = useSearch({ from: '/_auth/verify-otp' });

  const form = useForm<OTPFormValues>({
    resolver: customResolver(otpSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = async (values: OTPFormValues) => {
    try {
      // Here you would typically make an API call to verify the OTP
      console.log('OTP verification:', values.otp);

      // On successful verification, navigate to dashboard or next step
      navigate({ to: '/set-password' });
    } catch (error) {
      console.error('OTP verification error:', error);
      // Handle error appropriately
      form.setError('otp', {
        message: 'Invalid verification code. Please try again.',
      });
    }
  };

  const handleResendCode = () => {
    // Implement resend OTP logic
    console.log('Resending OTP to:', phone);
    // You could show a toast notification here
  };

  // Format phone number for display (mask most digits)
  const formatPhoneForDisplay = (phoneNumber?: string) => {
    if (!phoneNumber) return '***3323';
    const digits = phoneNumber.replace(/\D/g, '');
    return `***${digits.slice(-4)}`;
  };

  return (
    <div className="flex h-full w-full bg-white">
      <PageMetaTags
        title="Verify Your Account"
        description="Enter the verification code sent to your phone to complete account verification."
        keywords="account verification, OTP verification"
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
              Sign In{' '}
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-10 px-4 lg:px-0">
          <div className="flex w-full flex-col items-center gap-4 self-stretch px-4">
            <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Verify your Account</h1>
            <p className="text-center text-[14px] leading-[20px] text-[#71748C]">
              Enter the 6-digit code sent to your phone number ending with{' '}
              <span className="font-medium">{formatPhoneForDisplay(phone)}</span>
            </p>
          </div>

          <div className="flex w-full flex-col gap-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                {/* OTP Input */}
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col items-center gap-1.5">
                      <FormControl>
                        <InputOTP maxLength={6} value={field.value} onChange={field.onChange} className="w-full gap-2">
                          <InputOTPGroup className="w-full gap-4">
                            <InputOTPSlot index={0} className="size-14 rounded-[8px] text-lg" />

                            <InputOTPSlot index={1} className="size-14 rounded-[8px] text-lg" />
                            <InputOTPSlot index={2} className="size-14 rounded-[8px] text-lg" />
                            <InputOTPSlot index={3} className="size-14 rounded-[8px] text-lg" />
                            <InputOTPSlot index={4} className="size-14 rounded-[8px] text-lg" />
                            <InputOTPSlot index={5} className="size-14 rounded-[8px] text-lg" />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Verify Button */}
                <Button
                  type="submit"
                  style={{
                    background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                    boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                  }}
                  className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                  disabled={form.watch('otp').length !== 6}
                >
                  Verify
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-[14px] leading-[20px] text-[#41415A]">
                    Didn&apos;t receive?{' '}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-primary font-semibold hover:underline"
                    >
                      Resend Code
                    </button>
                  </p>
                </div>
              </form>
            </Form>
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
