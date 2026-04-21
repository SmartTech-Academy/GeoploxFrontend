import { Button } from "./ui/button";
import { Link, useRouter } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { useGetProfileData } from "@/lib/services/profile";
import { getLoginRedirectPath } from "@/lib/navigation";

const PermissionDenied = () => {
  const router = useRouter();
  const { data: user } = useGetProfileData();

  return (
    <div className="flex min-h-[500px] w-full items-center justify-center bg-white py-12">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-8 px-4 text-center">
        <ShieldAlert className="size-16 text-red-500" />

        <div className="flex flex-col items-center gap-4 self-stretch">
          <h1 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">
            Permission Denied
          </h1>
          <p className="text-[16px] leading-[22px] tracking-[-0.01em] text-[#41415A]">
            Oops! You do not have the necessary permissions to access this page.
          </p>
        </div>

        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row">
          <Button
            onClick={() => router.history.back()}
            variant="outline"
            className="h-11 flex-1 rounded-full px-5 py-2.5 text-base font-medium"
          >
            Go Back
          </Button>
          <Button
            asChild
            className="h-11 flex-1 rounded-full bg-black px-5 py-2.5 text-base font-medium text-white hover:bg-black/90"
          >
            <Link to={getLoginRedirectPath(user)}>Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionDenied;
