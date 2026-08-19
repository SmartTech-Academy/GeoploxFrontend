import type { AxiosError, AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
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
import { customResolver } from "@/lib/customZodResolver";
import { useLogin } from "@/lib/services";
import { toast } from "@/lib/toast";

export const loginSchema = z.object({
  email_or_username: z.string().min(1, "Email or Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

type ApiErrorPayload = {
  message?: string;
  data?: {
    error_message?: string[];
  };
};

interface LoginFormProps {
  /** Called after the login mutation succeeds (token already stored, queries already invalidated). */
  onSuccess: (response: AxiosResponse<any>) => void;
  showForgotPasswordLink?: boolean;
}

/**
 * The actual login form fields + submit logic, extracted out of the /login route so it can
 * also be rendered inside LoginDialog (the in-place "log in without leaving the page" modal
 * used by actions like Favorite that need to resume immediately after a successful login).
 */
export const LoginForm = ({ onSuccess, showForgotPasswordLink = true }: LoginFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate, isPending } = useLogin();

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
        onSuccess(response);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
        <div className="flex w-full flex-col gap-5">
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

          {showForgotPasswordLink && (
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-[14px]/5 text-[#D4AF36] hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}
        </div>

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
      </form>
    </Form>
  );
};
