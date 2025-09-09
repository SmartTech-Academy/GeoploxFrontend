import { Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

const RootLayout = () => {
  return (
    <div className="bg-background min-h-screen">
      {/* Main content */}
      <div className="h-full">
        <Outlet />
        <TanStackRouterDevtools />
      </div>
    </div>
  );
};

export default RootLayout;
