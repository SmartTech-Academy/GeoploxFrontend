import type { AxiosResponse } from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/login-form";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful login (token already stored) - use this to close the dialog and resume whatever action the user originally tried to perform. */
  onSuccess: (response: AxiosResponse<any>) => void;
  title?: string;
  description?: string;
}

/**
 * In-place login modal for actions (like Favorite) that need the user signed in but must not
 * navigate them away from where they are - unlike the redirect-to-/login pattern used by the
 * Contact/Chat buttons, this never leaves the current page/scroll position.
 */
export const LoginDialog = ({
  open,
  onOpenChange,
  onSuccess,
  title = "Sign in to continue",
  description = "Log in to your account to continue - you'll stay right where you are.",
}: LoginDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <LoginForm onSuccess={onSuccess} showForgotPasswordLink={false} />
      </DialogContent>
    </Dialog>
  );
};
