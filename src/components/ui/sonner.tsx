import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      duration={4500} // fallback for any raw sonner `toast()` call bypassing src/lib/toast.ts
      closeButton
      // Notifications stack (sonner's default) rather than overlapping, and are capped to a
      // sane width instead of spanning most of the viewport so they don't obscure the page
      // underneath while visible.
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          closeButton:
            "!bg-white/10 !border-white/20 !text-white hover:!bg-white/20",
          actionButton:
            "!py-[11px] !px-3 !h-[32px] !bg-white !border !border-[#D5D5DD] shadow-[0px_0px_10px_rgba(31,_33,_48,_0.06),_0px_1px_1px_rgba(31,_33,_48,_0.25),_inset_0px_2px_1px_rgba(255,_255,_255,_0.7)] !rounded-[30px]",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
        style: {
          maxWidth: "420px",
          borderRadius: "10px",
          backgroundColor: "#474747",
          border: "none",
          padding: "14px 16px",
          color: "white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
        },
      }}
      style={
        {
          "--normal-bg": "#4A4A57",
          "--normal-text": "white",
          "--normal-border": "transparent",
          position: "fixed",
          top: "16px",
          zIndex: 9999,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
