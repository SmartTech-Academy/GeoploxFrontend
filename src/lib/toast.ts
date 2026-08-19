import { toast as sonnerToast } from "sonner";
import type { ExternalToast } from "sonner";
import type { ReactNode } from "react";

export { Toaster } from "@/components/ui/sonner";

// Success/info/warning auto-dismiss after ~4-5s so they're readable at a glance without
// lingering; errors stay until the user closes them (paired with the Toaster's close button),
// since an error the user didn't get to read is worse than one that outstays its welcome.
const AUTO_DISMISS_MS = 4500;

const success = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.success(message, { duration: AUTO_DISMISS_MS, ...options });

const info = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.info(message, { duration: AUTO_DISMISS_MS, ...options });

const warning = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.warning(message, { duration: AUTO_DISMISS_MS, ...options });

const error = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.error(message, { duration: Infinity, ...options });

export const toast = Object.assign(
  (message: ReactNode, options?: ExternalToast) => sonnerToast(message, options),
  sonnerToast,
  { success, info, warning, error },
);
