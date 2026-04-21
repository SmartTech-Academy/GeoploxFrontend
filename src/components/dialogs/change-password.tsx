import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { Dispatch, SetStateAction } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { customResolver } from "@/lib/customZodResolver";
import z from "zod/v4";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useChangePassword } from "@/lib/services/profile";
import { toast } from "sonner";

interface PropertyProps {
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const passwordSchema = z.object({
  current_password: z.string().min(1, "Old password is required"),
  new_password: z.string().min(6, "New password must be at least 6 characters"),
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const ChangePassword: React.FC<PropertyProps> = ({ open, onOpenChange }) => {
  const { mutateAsync: changePassword, isPending } = useChangePassword();
  const form = useForm<PasswordFormValues>({
    resolver: customResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const [showOldPassword, setShowOldPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);

  async function onSubmit(values: PasswordFormValues) {
    try {
      await changePassword(values);
      toast.success("Password changed successfully!");
      onOpenChange(false);
      form.reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message || "An error occurred while changing your password.";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-5">
            <DialogHeader>
              <DialogTitle>Change Password</DialogTitle>
            </DialogHeader>

            <div className="flex w-full flex-col gap-5">
              {/* Old Password */}
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      Old Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Enter old password"
                          className="h-10 rounded-lg border-[#D5D5DD] pr-10"
                          {...field}
                        />
                        <span
                          className="absolute top-6 right-4 -translate-y-1/2 transform cursor-pointer text-[12px]/3.5  font-semibold text-primary hover:underline"
                          onClick={() => setShowOldPassword((prev) => !prev)}
                        >
                          {showOldPassword ? "Hide" : "Show"}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New Password */}
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem className="w-full gap-1.5">
                    <FormLabel className="text-[14px] leading-[17px] font-normal text-[#41415A]">
                      New Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          className="h-10 rounded-lg border-[#D5D5DD] pr-10"
                          {...field}
                        />
                        <span
                          className="absolute top-6 right-4 -translate-y-1/2 transform cursor-pointer text-[12px]/3.5  font-semibold text-primary hover:underline"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                        >
                          {showNewPassword ? "Hide" : "Show"}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  type="button"
                  className="h-8 rounded-4xl bg-[#F1F1F4] px-4 py-[15px] text-[12px]/3.5 font-semibold text-[#1F2130]"
                  variant="secondary"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                variant="default"
                style={{
                  background: "linear-gradient(180deg, #505050 0%, #1E1E1E 60%)",
                  boxShadow:
                    "0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)",
                }}
                disabled={isPending}
                className="h-8 rounded-4xl border border-[oklch(0.235_0_0/50%)] p-4 text-[12px]/3.5 font-semibold text-white"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
