import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import * as z from 'zod/v4';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

import assets from '@/assets';
import { customResolver } from '@/lib/customZodResolver';
import { PageMetaTags } from '@/components/page-meta-data';

// Zod schema for login form
const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: customResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      // Here you would typically make an API call to authenticate the user
      console.log('Login data:', values);

      // Navigate to dashboard
      navigate({ to: '/dashboard' });
    } catch (error) {
      console.error('Login error:', error);
      // Handle error appropriately
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google OAuth flow
    console.log('Login with Google');
  };

  const handleFacebookSignIn = () => {
    // Implement Facebook OAuth flow
    console.log('Login with Facebook');
  };

  return (
    <div className="flex h-full w-full bg-white">
      <PageMetaTags
        title="Login to Your Account"
        description="Access your Geoplox account to manage properties, view saved listings, and connect with buyers or sellers."
        keywords="geoplox login, property account access"
      />

      <div className="flex h-full min-h-screen w-full flex-col justify-between self-stretch py-10">
        {/* Header */}
        <div className="flex w-full items-center justify-between gap-6 px-4 lg:px-12">
          <Link to="/">
            <img src={assets.logotext} alt="logo" className="h-[46px] w-[126px]" width={126} height={46} />
          </Link>

          <span className="inline-flex gap-1 text-[14px] leading-[21px] text-[#41415A]">
            New User?{' '}
            <Link to="/register" className="font-semibold text-[#D4AF36] hover:underline">
              Create Account
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-10 px-4 lg:px-0">
          <div className="flex w-full flex-col items-center gap-4 self-stretch">
            <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Welcome Back</h1>
            <p className="text-[14px] leading-[20px] text-[#71748C]">Enter your details below to login</p>
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

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="G13p@7v#92LmZxQ"
                              className="h-10 w-full self-stretch rounded-[8px] border-[#D5D5DD] px-6 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-[#D4AF36] hover:text-[#B69118]"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-[14px] leading-[20px] text-[#D4AF36] hover:underline">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-start gap-7 self-stretch">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    style={{
                      background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                      boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                    }}
                    className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                  >
                    {form.formState.isSubmitting ? 'Signing In...' : 'Login'}
                  </Button>

                  <div className="flex w-full flex-col items-start gap-7">
                    {/* Divider */}
                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">OR</span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex w-full items-center justify-center gap-3 self-stretch lg:px-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        className="h-10 rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-[16px] font-normal text-[#1F2130] hover:bg-gray-50"
                      >
                        <img src={assets.google} alt="" className="size-4" width={16} height={16} />
                        Login with Google
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleFacebookSignIn}
                        className="h-10 rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-[16px] font-normal text-[#1F2130] hover:bg-gray-50"
                      >
                        <img src={assets.facebook} alt="" className="size-4" width={16} height={16} />
                        Login with Facebook
                      </Button>
                    </div>
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
