import Footer from '../footer';
import Topnav from '../topnav';
import { Outlet } from '@tanstack/react-router';

const LandingLayout = () => {
  return (
    <div className="w-full bg-[rgba(255,_255,_255,_0.8)] shadow-[0px_4px_16px_rgba(0,_0,_0,_0.08)]">
      <Topnav />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
