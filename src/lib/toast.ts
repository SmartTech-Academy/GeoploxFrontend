import { toast as sonnerToast } from "sonner";
import type { ExternalToast } from "sonner";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import { createElement } from "react";

export { Toaster } from "@/components/ui/sonner";

// Every toast auto-dismisses so nothing lingers forever, and every toast also keeps the
// Toaster's close button (manual dismiss) available regardless of type. Errors get a longer
// window since they tend to carry more to read, but they're no longer sticky/infinite -- a
// toast the user forgets to close is as bad a UX as one that vanishes before it's read.
const AUTO_DISMISS_MS = 5000;
const AUTO_DISMISS_ERROR_MS = 6500;

const icon = (Icon: typeof CheckCircle2) => createElement(Icon, { className: "h-[18px] w-[18px]" });

const success = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.success(message, {
    duration: AUTO_DISMISS_MS,
    icon: icon(CheckCircle2),
    ...options,
  });

const info = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.info(message, {
    duration: AUTO_DISMISS_MS,
    icon: icon(Info),
    ...options,
  });

const warning = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.warning(message, {
    duration: AUTO_DISMISS_MS,
    icon: icon(AlertTriangle),
    ...options,
  });

const error = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.error(message, {
    duration: AUTO_DISMISS_ERROR_MS,
    icon: icon(XCircle),
    ...options,
  });

const loading = (message: ReactNode, options?: ExternalToast) =>
  sonnerToast.loading(message, {
    icon: createElement(Loader2, { className: "h-[18px] w-[18px] animate-spin" }),
    ...options,
  });

export const toast = Object.assign(
  (message: ReactNode, options?: ExternalToast) => sonnerToast(message, options),
  sonnerToast,
  { success, info, warning, error, loading },
);
