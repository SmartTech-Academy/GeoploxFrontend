import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
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
            "group toast relative flex items-start gap-3 w-full rounded-2xl border backdrop-blur-xl px-4 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.25)] " +
            "bg-neutral-900/85 border-white/10 text-white " +
            "data-[type=success]:border-emerald-400/25 data-[type=success]:shadow-[0_8px_30px_rgba(16,185,129,0.18)] " +
            "data-[type=error]:border-rose-400/25 data-[type=error]:shadow-[0_8px_30px_rgba(244,63,94,0.18)] " +
            "data-[type=warning]:border-amber-400/25 data-[type=warning]:shadow-[0_8px_30px_rgba(245,158,11,0.18)] " +
            "data-[type=info]:border-sky-400/25 data-[type=info]:shadow-[0_8px_30px_rgba(56,189,248,0.18)]",
          icon:
            "!m-0 flex h-8 w-8 shrink-0 items-center justify-center rounded-full " +
            "group-data-[type=success]:bg-emerald-400/15 group-data-[type=success]:text-emerald-400 " +
            "group-data-[type=error]:bg-rose-400/15 group-data-[type=error]:text-rose-400 " +
            "group-data-[type=warning]:bg-amber-400/15 group-data-[type=warning]:text-amber-400 " +
            "group-data-[type=info]:bg-sky-400/15 group-data-[type=info]:text-sky-400 " +
            "group-data-[type=default]:bg-white/10 group-data-[type=default]:text-white/80 " +
            "group-data-[type=loading]:bg-white/10 group-data-[type=loading]:text-white/80 " +
            "[&_svg]:h-4.5 [&_svg]:w-4.5",
          content: "flex-1 min-w-0 pt-0.5",
          title: "text-[14px] font-medium leading-snug text-white",
          description: "text-[13px] leading-snug text-white/60 mt-0.5",
          closeButton:
            "!absolute !left-auto !right-1.5 !top-1.5 !translate-x-0 !translate-y-0 !bg-white/10 !border-white/10 !text-white/70 hover:!bg-white/20 hover:!text-white !rounded-full !h-5 !w-5 !flex !items-center !justify-center",
          actionButton:
            "!py-[11px] !px-3 !h-[32px] !bg-white !text-neutral-900 !border-0 shadow-[0px_1px_1px_rgba(31,33,48,0.25)] !rounded-full",
          cancelButton: "!bg-white/10 !text-white/70 !rounded-full",
        },
      }}
      style={
        {
          position: "fixed",
          top: "16px",
          zIndex: 9999,
          "--width": "380px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
