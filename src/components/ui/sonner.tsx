import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';
import { useSidebar } from '../ui/sidebar';
import { TriangleAlert } from 'lucide-react';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();
  const { state, isMobile } = useSidebar();

  // Calculate the left offset based on sidebar state and mobile
  const sidebarWidth = state === 'collapsed' ? '64px' : '232px';

  // On mobile, use full width and position at left 0
  const toastWidth = isMobile ? '100vw' : `calc(100vw - ${sidebarWidth} - 8px)`;
  const leftPosition = isMobile ? '0px' : `calc(${sidebarWidth} + 180px)`;

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-center"
      duration={Infinity} // 8 seconds timeout
      closeButton={false} // We'll add our own close button
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            '!py-[11px] !px-3 !h-[32px] !bg-white !border !border-[#D5D5DD] shadow-[0px_0px_10px_rgba(31,_33,_48,_0.06),_0px_1px_1px_rgba(31,_33,_48,_0.25),_inset_0px_2px_1px_rgba(255,_255,_255,_0.7)] !rounded-[30px]',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },

        style: {
          width: toastWidth,
          maxWidth: 'none',
          margin: '0',
          borderRadius: '0px',
          backgroundColor: '#474747', // Dark gray background like in image
          border: 'none',
          padding: '16px 20px',
          color: 'white',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }}
      icons={{
        success: <TriangleAlert className="size-4 text-white" />,
        error: <TriangleAlert className="size-4 text-white" />,
        warning: <TriangleAlert className="size-4 text-white" />,
        info: <TriangleAlert className="size-4 text-white" />,
      }}
      style={
        {
          '--normal-bg': '#4A4A57',
          '--normal-text': 'white',
          '--normal-border': 'transparent',
          position: 'fixed',
          top: '72px',
          left: leftPosition,
          right: isMobile ? '0px' : '0px',
          zIndex: 9999,
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
