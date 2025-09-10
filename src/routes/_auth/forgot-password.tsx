import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import * as z from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import assets from '@/assets';
import { customResolver } from '@/lib/customZodResolver';
import { PageMetaTags } from '@/components/page-meta-data';

// Zod schema for forgot password form
const forgotPasswordSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const Route = createFileRoute('/_auth/forgot-password')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: customResolver(forgotPasswordSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      // Here you would typically make an API call to send password reset email
      console.log('Password reset email sent to:', values.email);

      // Navigate to password reset confirmation
      navigate({
        to: '/password-reset-sent',
        search: { email: values.email },
      });
    } catch (error) {
      console.error('Password reset error:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="flex h-full w-full bg-white">
      <PageMetaTags
        title="Reset Your Password"
        description="Forgot your password? Reset it securely to regain access to your Geoplox account."
        keywords="password reset, account recovery"
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
          <div className="flex w-full flex-col items-center gap-4 self-stretch">
            <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Forgot Password</h1>
            <p className="text-center text-[14px] leading-[20px] text-[#71748C]">
              Provide the email on your account and we&apos;ll send details to reset your password
            </p>
          </div>

          <div className="flex w-full flex-col gap-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                <div className="flex w-full flex-col gap-5">
                  {/* Email Address */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="rene_realty@forbes.com"
                            className="h-10 w-full self-stretch rounded-[8px] border-[#D5D5DD] px-6"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col items-start gap-4 self-stretch">
                  <div className="flex items-center justify-center gap-3 self-stretch">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate({ to: '/login' })}
                      className="h-10 flex-1 rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-[16px] font-normal text-[#1F2130] hover:bg-gray-50"
                    >
                      Back to Login
                    </Button>

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      style={{
                        background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                        boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                      }}
                      className="h-10 flex-1 rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                    >
                      {form.formState.isSubmitting ? 'Sending...' : 'Reset Password'}
                    </Button>
                  </div>
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
