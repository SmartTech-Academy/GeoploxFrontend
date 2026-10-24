import { Toaster as Sonner, ToasterProps } from "sonner";

// Bootstrap 5 alert palette (light bg / dark text / matching border) per toast type, so
// success/info/warning/danger read instantly by colour, the way Bootstrap alerts do. This is
// intentionally always "light" regardless of the app's own dark/light mode -- Bootstrap alerts
// are a light-surface design by definition, and sonner's dark theme forces a light gray text
// color on the description slot that `unstyled` doesn't fully strip, so pinning "light" here
// keeps text legible against our colored backgrounds without fighting sonner's internals.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      position="top-right"
      duration={5000} // fallback for any raw sonner `toast()` call bypassing src/lib/toast.ts
      closeButton
      gap={10}
      // Notifications stack (sonner's default) rather than overlapping, and are capped to a
      // sane width instead of spanning most of the viewport so they don't obscure the page
      // underneath while visible.
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast relative flex items-start gap-3 w-full rounded-2xl border px-4 py-3.5 shadow-[0_8px_24px_rgba(0,0,0,0.12)] " +
            // default / plain toast() calls -- Bootstrap "secondary" style
            "bg-[#e2e3e5] border-[#d3d6d8] text-[#41464b] " +
            // success -- Bootstrap alert-success
            "data-[type=success]:bg-[#d1e7dd] data-[type=success]:border-[#a3cfbb] data-[type=success]:text-[#0f5132] " +
            // error -> Bootstrap alert-danger
            "data-[type=error]:bg-[#f8d7da] data-[type=error]:border-[#f1aeb5] data-[type=error]:text-[#842029] " +
            // warning -- Bootstrap alert-warning
            "data-[type=warning]:bg-[#fff3cd] data-[type=warning]:border-[#ffe69c] data-[type=warning]:text-[#664d03] " +
            // info -- Bootstrap alert-info
            "data-[type=info]:bg-[#cff4fc] data-[type=info]:border-[#b6effb] data-[type=info]:text-[#055160] " +
            // loading -- Bootstrap "light"
            "data-[type=loading]:bg-[#fefefe] data-[type=loading]:border-[#e9ecef] data-[type=loading]:text-[#495057]",
          icon:
            "!m-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 " +
            "group-data-[type=success]:text-[#0f5132] " +
            "group-data-[type=error]:text-[#842029] " +
            "group-data-[type=warning]:text-[#664d03] " +
            "group-data-[type=info]:text-[#055160] " +
            "group-data-[type=loading]:text-[#495057] " +
            "[&_svg]:h-4.5 [&_svg]:w-4.5",
          content: "flex-1 min-w-0 pt-0.5",
          title: "text-[14px] font-semibold leading-snug",
          description: "text-[13px] leading-snug opacity-80 mt-0.5",
          closeButton:
            "!absolute !left-auto !right-1.5 !top-1.5 !translate-x-0 !translate-y-0 !bg-black/5 !border-0 !text-current !opacity-60 hover:!opacity-100 hover:!bg-black/10 !rounded-full !h-5 !w-5 !flex !items-center !justify-center",
          actionButton:
            "!py-[11px] !px-3 !h-[32px] !bg-black/80 !text-white !border-0 !rounded-full",
          cancelButton: "!bg-black/5 !text-current !rounded-full",
        },
      }}
      style={
        {
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 9999,
          "--width": "380px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
