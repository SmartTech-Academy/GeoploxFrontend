import assets from '@/assets';
import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';

const Topnav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { to: '/buy', label: 'Buy' },
    { to: '/rent', label: 'Rent' },
    { to: '/sell', label: 'Sell' },
    { to: '/blog', label: 'Blog' },
    { to: '/pricing', label: 'Pricing' },
  ];

  const NavLink = ({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) => (
    <Link
      to={to}
      className="text-[14px] leading-[13px] font-normal text-[#1F2130] transition-colors hover:text-[#D4AF36] [&.active]:font-semibold [&.active]:text-[#D4AF36]"
      activeProps={{
        className: 'text-[14px] leading-[13px] font-semibold text-[#D4AF36]',
      }}
      onClick={onClick}
    >
      {label}
    </Link>
  );

  return (
    <nav className="fixed top-0 right-0 left-0 z-20 h-(--landing-header-height) w-full bg-[rgba(255,_255,_255,_0.8)] shadow-[0px_4px_16px_rgba(0,_0,_0,_0.08)] backdrop-blur-sm">
      <div className="landing-container flex h-(--landing-header-height) w-full items-center justify-between px-4 py-2.5 md:px-0">
        {/* Logo */}
        <Link to="/">
          <img src={assets.logotext} alt="logo" className="h-8 w-auto md:h-10 md:w-[126px]" width={126} height={40} />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex md:items-center">
          {navigationLinks.map((link, index) => (
            <>
              <li key={link.to} className="isolate flex h-12 w-[80px] items-center justify-center">
                <NavLink to={link.to} label={link.label} />
              </li>
              {index < navigationLinks.length - 1 && <li key={`divider-${index}`} className="h-3 w-0.5 bg-[#B1B9C7]" />}
            </>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button
            asChild
            className="h-10 rounded-[40px] bg-[#F1F1F4] px-4 py-[15px] text-[14px] leading-[17px] font-semibold text-[#1F2130] transition-colors hover:bg-[#1F2130] hover:text-white"
          >
            <Link to="/login">Sign in</Link>
          </Button>

          <Button
            style={{
              background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
              border: '1px solid rgba(30, 30, 30, 0.5)',
              boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
            }}
            className="flex h-10 items-center justify-center rounded-[40px] p-4 text-[14px] leading-[17px] font-semibold text-white transition-opacity hover:opacity-90"
            asChild
          >
            <Link to="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="size-10 p-0 hover:bg-[#F1F1F4]">
                <Menu className="size-6 text-[#1F2130]" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex h-full flex-col p-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b pb-6">
                  <Link to="/">
                    <img src={assets.logotext} alt="logo" className="h-8 w-auto" />
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-1 flex-col gap-1 py-6">
                  {navigationLinks.map((link) => (
                    <div key={link.to} className="border-b border-gray-100 px-2 py-3 last:border-b-0">
                      <NavLink to={link.to} label={link.label} onClick={() => setIsOpen(false)} />
                    </div>
                  ))}
                </div>

                {/* Mobile Auth Buttons - Full Width */}
                <div className="flex flex-col gap-3 border-t pt-6">
                  <Button
                    asChild
                    className="h-12 rounded-[40px] bg-[#F1F1F4] text-[14px] font-semibold text-[#1F2130] transition-colors hover:bg-[#1F2130] hover:text-white"
                  >
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      Sign in
                    </Link>
                  </Button>

                  <Button
                    style={{
                      background: 'linear-gradient(180deg, #505050 0%, #1E1E1E 60%)',
                      border: '1px solid rgba(30, 30, 30, 0.5)',
                      boxShadow: '0px 4px 3px rgba(31, 33, 48, 0.1), inset 0px 2px 1px rgba(255, 255, 255, 0.25)',
                    }}
                    className="h-12 rounded-[40px] text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                    asChild
                  >
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Topnav;
