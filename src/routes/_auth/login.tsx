import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

import assets from "@/assets";
import { customResolver } from "@/lib/customZodResolver";
import { useLogin } from "@/lib/services";
import { PageMetaTags } from "@/components/page-meta-data";

import { toast } from "sonner";
import { getLoginRedirectPath } from "@/lib/navigation";

// Zod schema for login form
const loginSchema = z.object({
  email_or_username: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type ApiErrorPayload = {
  message?: string;
  data?: {
    error_message?: string[];
  };
};

interface LoginSearch {
  redirect?: string;
  resetSuccess?: string;
}

export const Route = createFileRoute("/_auth/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    resetSuccess: typeof search.resetSuccess === "string" ? search.resetSuccess : undefined,
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { redirect, resetSuccess } = useSearch({ from: "/_auth/login" });
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();

  // reset-password.tsx sends ?resetSuccess=true after a successful password reset; this was
  // previously sent but never actually read/displayed here.
  useEffect(() => {
    if (resetSuccess === "true") {
      toast.success("Password reset successful. Please log in with your new password.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: customResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email_or_username: "",
      password: "",
    },
  });

  const getErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError<ApiErrorPayload>;
    const backendMessage =
      axiosError.response?.data?.message || axiosError.response?.data?.data?.error_message?.[0];
    if (backendMessage) return backendMessage;
    if (error instanceof Error && error.message) return error.message;
    return "Invalid credentials. Please try again.";
  };

  const onSubmit = (values: LoginFormValues) => {
    mutate(values, {
      onSuccess: (response) => {
        toast.success("Login successful!");
        const user = response.data?.data?.user_data;
        // If the user was sent here from a specific page (e.g. "Sign in to see contact
        // details" or a "Contact" button on a listing they weren't logged in to use), send
        // them right back there instead of the generic role-based dashboard landing page. A
        // full navigation (rather than the router's typed `navigate`) is used here since
        // `redirect` is an arbitrary path outside the router's known route table.
        if (redirect) {
          window.location.href = redirect;
          return;
        }
        navigate({ to: getLoginRedirectPath(user) });
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        const lowerMessage = message.toLowerCase();
        const isNotActivatedError =
          lowerMessage.includes("account not activated") ||
          lowerMessage.includes("activate your account");

        if (isNotActivatedError) {
          toast.error(message);
          navigate({
            to: "/verify-otp",
            search: { email: values.email_or_username },
          });
          return;
        }

        form.setError("password", {
          type: "manual",
          message,
        });
      },
    });
  };

  //   const handleGoogleSignIn = () => {
  //     toast('Coming soon');
  //   };

  //   const handleFacebookSignIn = () => {
  //     toast('Coming soon');
  //   };

  return (
    <div className="flex size-full bg-white">
      <PageMetaTags
        title="Login to Your Account"
        description="Access your Geoplox account to manage properties, view saved listings, and connect with buyers or sellers."
        keywords="geoplox login, property account access"
      />

      <div className="flex size-full min-h-screen flex-col justify-between self-stretch py-10">
        {/* Header */}
        <div className="flex w-full items-center justify-between gap-6 px-4 lg:px-12">
          <Link to="/">
            <img
              src={assets.logotext}
              alt="logo"
              className="h-[46px] w-[126px]"
              width={126}
              height={46}
            />
          </Link>

          <span className="inline-flex gap-1 text-[14px] leading-[21px] text-[#41415A]">
            New User?{" "}
            <Link to="/register" className="font-semibold text-[#D4AF36] hover:underline">
              Create Account
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-10 px-4 lg:px-0">
          <div className="flex w-full flex-col items-center gap-4 self-stretch">
            <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">
              Welcome Back
            </h1>
            <p className="text-[14px]/5 text-[#71748C]">Enter your details below to login</p>
          </div>

          <div className="flex w-full flex-col gap-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                <div className="flex w-full flex-col gap-5">
                  {/* Email Address */}
                  <FormField
                    control={form.control}
                    name="email_or_username"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="rene_realty@forbes.com"
                            className="h-10 w-full self-stretch rounded-xl border-[#D5D5DD] px-6"
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
                              type={showPassword ? "text" : "password"}
                              placeholder="G13p@7v#92LmZxQ"
                              className="h-10 w-full self-stretch rounded-xl border-[#D5D5DD] px-6 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute top-1/2 right-3 -translate-y-1/2 transform text-[#D4AF36] hover:text-[#B69118]"
                            >
                              {showPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Forgot Password Link */}
                  <div className="flex justify-end">
                    <Link
                      to="/forgot-password"
                      className="text-[14px]/5 text-[#D4AF36] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-start gap-7 self-stretch">
                  <Button
                    type="submit"
                    disabled={isPending}
                    style={{
                      background: "linear-gradient(180deg, #D4AF36 0%, #B69118 60%)",
                      boxShadow:
                        "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                    }}
                    className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                  >
                    {isPending ? "Signing In..." : "Login"}
                  </Button>

                  {/* <div className="flex w-full flex-col items-start gap-7">

                    <div className="relative w-full">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">OR</span>
                      </div>
                    </div>


                    <div className="flex w-full items-center justify-center gap-3 self-stretch lg:px-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleGoogleSignIn}
                        className="h-10 rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-4 font-normal text-[#1F2130] hover:bg-gray-50"
                      >
                        <img src={assets.google} alt="" className="size-4" width={16} height={16} />
                        Login with Google
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleFacebookSignIn}
                        className="h-10 rounded-[40px] border border-[#E3E3E8] px-4 py-[15px] text-[14px] leading-4 font-normal text-[#1F2130] hover:bg-gray-50"
                      >
                        <img src={assets.facebook} alt="" className="size-4" width={16} height={16} />
                        Login with Facebook
                      </Button>
                    </div>
                  </div> */}
                </div>
              </form>
            </Form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-[14px]/5 text-[#41415A]">
            © {new Date().getFullYear()} — Geoplox, All Right Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
