import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import * as z from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useResend, useVerify } from '@/lib/services';

import assets from '@/assets';
import { Link } from '@tanstack/react-router';
import { customResolver } from '@/lib/customZodResolver';
import { PageMetaTags } from '@/components/page-meta-data';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

// Zod schema for OTP verification
const otpSchema = z.object({
  otp: z.string().min(6, 'Please enter the complete 6-digit code').max(6, 'Code must be exactly 6 digits'),
});

type OTPFormValues = z.infer<typeof otpSchema>;

// Search params type
type VerifyOTPSearch = {
  email: string;
  phone?: string;
};

export const Route = createFileRoute('/_auth/verify-otp')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): VerifyOTPSearch => {
    return {
      email: search.email as string,
      phone: typeof search.phone === 'string' ? search.phone : undefined,
    };
  },
});

function RouteComponent() {
  const navigate = useNavigate();
  const { email, phone } = useSearch({ from: '/_auth/verify-otp' });
  const { mutate: verifyOtp, isPending: isVerifying } = useVerify();
  const { mutate: resendCode, isPending: isResending } = useResend();
  const [countdown, setCountdown] = useState(0);
  const [localOTP, setLocalOTP] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const form = useForm<OTPFormValues>({
    resolver: customResolver(otpSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      otp: '',
    },
  });

  const onSubmit = (values: OTPFormValues) => {
    // Here you would typically make an API call to verify the OTP

    const payload = {
      email_or_username: email,
      activation_code: values.otp,
    };

    verifyOtp(payload, {
      onSuccess: (response) => {
        toast.success('Account created successfully!');
        const responseData = response.data?.data;
        const token = responseData?.access_token;
        const user = responseData?.user_data;
        if (token) {
          localStorage.setItem('token', token);
        }
        const userEmail = user?.email_address;
        navigate({
          to: '/account-ready',
          search: { email: userEmail || email },
        });
      },
      onError: (error: any) => {
        const message = error.response?.data?.message || 'Registration failed. Please try again.';
        toast.error(message);
        form.setError('otp', {
          message: 'Invalid verification code. Please try again.',
        });
      },
    });
  };

  const handleResendCode = () => {
    if (countdown > 0 || isResending) return;

    resendCode(
      { email },
      {
        onSuccess: () => {
          toast.info('A new verification code has been sent.');
          setCountdown(30);
        },
      }
    );
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
            <p className="text-center text-[14px] leading-5 text-[#71748C]">
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
                        <InputOTP
                          value={field.value}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                            setLocalOTP(newValue);
                          }}
                          maxLength={6}
                          className="w-full gap-2"
                        >
                          <InputOTPGroup className="w-full gap-4">
                            <InputOTPSlot index={0} className="size-14 rounded-xl text-lg" />
                            <InputOTPSlot index={1} className="size-14 rounded-xl text-lg" />
                            <InputOTPSlot index={2} className="size-14 rounded-xl text-lg" />
                            <InputOTPSlot index={3} className="size-14 rounded-xl text-lg" />
                            <InputOTPSlot index={4} className="size-14 rounded-xl text-lg" />
                            <InputOTPSlot index={5} className="size-14 rounded-xl text-lg" />
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
                  className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                  disabled={localOTP.length !== 6 || isVerifying}
                >
                  {isVerifying ? 'Verifying...' : 'Verify'}
                </Button>

                {/* Resend Code */}
                <div className="text-center">
                  <p className="text-[14px] leading-5 text-[#41415A]">
                    Didn&apos;t receive?{' '}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-primary font-semibold hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                      disabled={countdown > 0 || isResending}
                    >
                      {isResending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                    </button>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[14px] leading-5 text-[#41415A]">© 2025 — Geoplox, All Right Reserved.</p>
        </div>
      </div>
    </div>
  );
}
