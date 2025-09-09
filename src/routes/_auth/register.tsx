import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import * as z from 'zod/v4';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import assets from '@/assets';
import { NIGERIAN_PHONE_REGEX } from '@/lib/utils';
import { customResolver } from '@/lib/customZodResolver';
import { PageMetaTags } from '@/components/page-meta-data';

// Zod schema for registration form
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  phoneNumber: z
    .string()
    .min(11, { error: 'Phone number must be 11 digits' })
    .max(11, { error: 'Phone number must be 11 digits' })
    .regex(NIGERIAN_PHONE_REGEX, {
      error: 'Please enter a valid Nigerian phone number starting with 070, 080, 081, or 090',
    }),
  email: z.email('Please enter a valid email address'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Route = createFileRoute('/_auth/register')({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: customResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      phoneNumber: '',
      email: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      // Here you would typically make an API call to register the user
      console.log('Registration data:', values);

      // Navigate to OTP verification page
      navigate({ to: '/verify-otp', search: { phone: values.phoneNumber } });
    } catch (error) {
      console.error('Registration error:', error);
      // Handle error appropriately
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google OAuth flow
    console.log('Continue with Google');
  };

  const handleFacebookSignIn = () => {
    // Implement Facebook OAuth flow
    console.log('Continue with Facebook');
  };

  return (
    <div className="flex h-full w-full bg-white">
      <PageMetaTags
        title="Create Your Account"
        description="Join thousands of users on Geoplox. Create your free account to start buying, selling, or renting properties."
        keywords="geoplox signup, create property account, join geoplox"
      />
      <div className="flex h-full min-h-screen w-full flex-col justify-between gap-5 self-stretch py-10">
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

        <div className="mx-auto flex w-full flex-col items-center gap-10 px-4 lg:max-w-[560px] lg:px-0">
          <div className="flex w-full flex-col items-center gap-4 self-stretch">
            <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Get Started</h1>
            <p className="text-[14px] leading-[20px] text-[#71748C]">Complete your onboarding in 10 minutes.</p>
          </div>

          <div className="flex w-full flex-col gap-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                <div className="flex w-full flex-col gap-5">
                  {/* First Name and Last Name Row */}
                  <div className="grid w-full gap-5 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full gap-1.5">
                          <FormLabel className="leadinng-[17px] text-[14px] font-normal text-[#41415A]">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              className="h-10 w-full self-stretch rounded-[8px] border-[#D5D5DD] px-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full gap-1.5">
                          <FormLabel className="leadinng-[17px] text-[14px] font-normal text-[#41415A]">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              className="h-10 w-full self-stretch rounded-[8px] border-[#D5D5DD] px-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Username and Phone Number Row */}
                  <div className="grid gap-4 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="w-full gap-1.5">
                          <FormLabel className="leadinng-[17px] text-[14px] font-normal text-[#41415A]">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              className="h-10 w-full self-stretch rounded-[8px] border-[#D5D5DD] px-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="w-full gap-1.5">
                          <FormLabel className="leadinng-[17px] text-[14px] font-normal text-[#41415A]">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0805-555-3323"
                              className="h-10 w-full self-stretch rounded-[8px] border-[#D5D5DD] px-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email Address */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="leadinng-[17px] text-[14px] font-normal text-[#41415A]">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder=""
                            className="h-10 w-full self-stretch rounded-[8px] border-[#D5D5DD] px-6"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-start gap-7 self-stretch">
                  <Button
                    type="submit"
                    style={{
                      background: 'linear-gradient(180deg, #D4AF36 0%, #B69118 60%)',
                      boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                    }}
                    className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15_/_50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                  >
                    Get Started
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
                        className="h-10 grow rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-[16px] font-normal text-[#1F2130] hover:bg-gray-50"
                      >
                        <img src={assets.google} alt="" className="size-4" width={16} height={16} />
                        Continue with Google
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleFacebookSignIn}
                        className="h-10 grow rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-[16px] font-normal text-[#1F2130] hover:bg-gray-50"
                      >
                        <img src={assets.facebook} alt="" className="size-4" width={16} height={16} />
                        Continue with Facebook
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
