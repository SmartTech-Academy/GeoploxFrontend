import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";
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
import assets from "@/assets";
import { customResolver } from "@/lib/customZodResolver";
import { PageMetaTags } from "@/components/page-meta-data";
import { useVaidateRegistrationData } from "@/lib/services";
import { toast } from "@/lib/toast";

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.email("Please enter a valid email address"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/_auth/cloned/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { mutate, isPending } = useVaidateRegistrationData();
  const form = useForm<RegisterFormValues>({
    resolver: customResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      phoneNumber: "",
      email: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutate(
      {
        phone: values.phoneNumber,
        email: values.email,
        username: values.username,
      },
      {
        onSuccess: () => {
          toast.success("Registration data validated successfully");
          navigate({
            to: "/cloned/set-password",
            search: values,
          });
        },
      },
    );
  };

  return (
    <div className="flex size-full bg-white">
      <PageMetaTags
        title="Create Your Account"
        description="Join thousands of users on Geoplox. Create your free account to start buying, selling, or renting properties."
        keywords="geoplox signup, create property account, join geoplox"
      />
      <div className="flex size-full min-h-screen flex-col justify-between gap-5 self-stretch py-10">
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
            Have an Account?{" "}
            <Link to="/login" className="font-semibold text-[#D4AF36] hover:underline">
              Sign In{" "}
            </Link>
          </span>
        </div>

        <div className="mx-auto flex w-full flex-col items-center gap-10 px-4 lg:max-w-[560px] lg:px-0">
          <div className="flex w-full flex-col items-center gap-4 self-stretch">
            <h1 className="text-[28px] leading-[39px] font-semibold text-[#1F2130]">Get Started</h1>
            <p className="text-[14px]/5 text-[#71748C]">Complete your onboarding in 10 minutes.</p>
          </div>

          <div className="flex w-full flex-col gap-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
                <fieldset
                  disabled={form.formState.isSubmitting}
                  className="flex w-full flex-col gap-5"
                >
                  <div className="grid w-full gap-5 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-full gap-1.5">
                          <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="lastName"
                      render={({ field }) => (
                        <FormItem className="w-full gap-1.5">
                          <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
                              className="h-10 w-full self-stretch rounded-xl border-[#D5D5DD] px-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem className="w-full gap-1.5">
                          <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder=""
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
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem className="w-full gap-1.5">
                          <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                            Phone Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="0805-555-3323"
                              className="h-10 w-full self-stretch rounded-xl border-[#D5D5DD] px-6"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            placeholder=""
                            className="h-10 w-full self-stretch rounded-xl border-[#D5D5DD] px-6"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </fieldset>

                <div className="flex flex-col items-start gap-7 self-stretch">
                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || isPending || form.formState.isSubmitting}
                    style={{
                      background: "linear-gradient(180deg, #D4AF36 0%, #B69118 60%)",
                      boxShadow:
                        "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                    }}
                    className="h-10 w-full rounded-[40px] border border-[oklch(0.7665_0.1393_91.15/50%)] p-4 text-[14px] leading-[17px] font-semibold text-white"
                  >
                    {isPending ? "Validating..." : "Get Started"}
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
