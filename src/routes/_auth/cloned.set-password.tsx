import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
import { useState } from "react";
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
import { Check, ChevronLeft, Eye, EyeOff, X } from "lucide-react";
import { useOverrideRegister } from "@/lib/services";
import assets from "@/assets";
import { customResolver } from "@/lib/customZodResolver";
import { PageMetaTags } from "@/components/page-meta-data";
import { toast } from "@/lib/toast";

type SetPasswordSearch = {
  firstName: string;
  lastName: string;
  username: string;
  phoneNumber: string;
  email: string;
};

export const Route = createFileRoute("/_auth/cloned/set-password")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): SetPasswordSearch => ({
    ...search,
    firstName: search.firstName as string,
    lastName: search.lastName as string,
    username: search.username as string,
    phoneNumber: search.phoneNumber as string,
    email: search.email as string,
  }),
});

const passwordSchema = z
  .string()
  .min(8, "Minimum 8 characters")
  .regex(/[a-z]/, "One lowercase letter")
  .regex(/[A-Z]/, "One uppercase letter")
  .regex(/[0-9]/, "One number")
  .regex(/[^a-zA-Z0-9]/, "One special character")
  .refine((val) => !/\s/.test(val), "No space");

const formSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    { id: "lowercase", test: /[a-z]/, label: "One lowercase letter" },
    { id: "uppercase", test: /[A-Z]/, label: "One uppercase letter" },
    { id: "special", test: /[^a-zA-Z0-9]/, label: "One special character" },
    { id: "number", test: /[0-9]/, label: "One number" },
    { id: "nospace", test: /^\S*$/, label: "No space" },
    { id: "minlength", test: /.{8,}/, label: "Minimum 8 character" },
  ];

  return (
    <div className="space-y-2">
      {requirements.map((req) => {
        const isValid = password ? req.test.test(password) : false;
        return (
          <div key={req.id} className="flex items-center gap-2 text-sm">
            {isValid ? (
              <Check className="size-4 text-green-600" />
            ) : (
              <X className="size-4 text-red-500" />
            )}
            <span className={isValid ? "text-green-600" : "text-red-500"}>{req.label}</span>
          </div>
        );
      })}
    </div>
  );
};

function RouteComponent() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const searchParams = useSearch({ from: "/_auth/cloned/set-password" });
  const { mutate, isPending } = useOverrideRegister();

  const form = useForm<FormValues>({
    resolver: customResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const registrationData = {
      fname: searchParams.firstName,
      lname: searchParams.lastName,
      username: searchParams.username,
      phone: searchParams.phoneNumber,
      email: searchParams.email,
      password: values.password,
    };

    mutate(registrationData, {
      onSuccess: (response) => {
        const message =
          response?.data?.message ||
          "Registration successful. You can now continue from the cloned signup form.";
        toast.success(message);
        form.reset();
        navigate({ to: "/cloned/register" });
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : "Registration failed.";
        toast.error(message);
        navigate({ to: "/cloned/register" });
      },
    });
  };

  return (
    <div className="flex size-full bg-white">
      <PageMetaTags
        title="Set Your Password"
        description="Complete your account setup by creating a secure password."
        keywords="account setup, create password"
      />
      <div className="flex size-full min-h-screen flex-col justify-between self-stretch py-10">
        <div className="flex w-full items-center justify-between gap-6 px-4 lg:px-12">
          <img
            src={assets.logotext}
            alt="logo"
            className="h-[46px] w-[126px]"
            width={126}
            height={46}
          />

          <span className="inline-flex gap-1 text-[14px] leading-[21px] text-[#41415A]">
            Have an Account?{" "}
            <Link to="/login" className="font-semibold text-[#D4AF36] hover:underline">
              Sign In{" "}
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center gap-10 px-4 lg:px-0">
          <button
            onClick={() => {
              navigate({
                to: "/cloned/register",
                search: {
                  firstName: searchParams.firstName,
                  lastName: searchParams.lastName,
                  username: searchParams.username,
                  phoneNumber: searchParams.phoneNumber,
                  email: searchParams.email,
                },
              });
            }}
            className="flex w-full items-center gap-2 text-[#D4AF36] transition-colors hover:text-[#B69118]"
          >
            <ChevronLeft className="size-5" />
            <span className="text-[14px] leading-[21px] font-medium">Back</span>
          </button>
          <div className="flex w-full flex-col items-center gap-4 self-stretch">
            <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">
              Create Password
            </h1>
            <p className="text-[14px]/5 text-[#71748C]">Complete your onboarding in 10 minutes.</p>
          </div>

          <div className="flex w-full flex-col gap-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                <div className="flex w-full flex-col gap-1.5">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                          Create Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              className="h-10 w-full self-stretch rounded-xl border-[#D5D5DD] px-6 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#D4AF36] hover:text-[#B69118]"
                            >
                              {showPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <div className="w-full">
                          <PasswordRequirements password={form.getValues().password} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="w-full gap-1.5">
                        <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              className="h-10 w-full self-stretch rounded-xl border-[#D5D5DD] px-6 pr-12"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#D4AF36] hover:text-[#B69118]"
                            >
                              {showConfirmPassword ? (
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
                </div>

                <div className="flex flex-col items-start gap-7 self-stretch">
                  <Button
                    type="submit"
                    style={{
                      background: "linear-gradient(180deg, #D4AF36 0%, #B69118 60%)",
                      boxShadow:
                        "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                    }}
                    className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                    disabled={!form.formState.isValid || isPending}
                  >
                    {isPending ? "Creating Account..." : "Continue"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <div className="text-center">
          <p className="text-[14px]/5 text-[#41415A]">
            © {new Date().getFullYear()} — Geoplox, All Right Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
