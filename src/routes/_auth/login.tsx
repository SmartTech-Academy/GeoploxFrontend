import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect } from "react";

import assets from "@/assets";
import { PageMetaTags } from "@/components/page-meta-data";
import { LoginForm } from "@/components/auth/login-form";

import { toast } from "sonner";
import { getLoginRedirectPath } from "@/lib/navigation";
import type { UserProfile } from "@/lib/types";

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

  // reset-password.tsx sends ?resetSuccess=true after a successful password reset; this was
  // previously sent but never actually read/displayed here.
  useEffect(() => {
    if (resetSuccess === "true") {
      toast.success("Password reset successful. Please log in with your new password.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoginSuccess = (response: {
    data?: { data?: { user_data?: UserProfile | null } };
  }) => {
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
  };

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
            <LoginForm onSuccess={handleLoginSuccess} />
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
