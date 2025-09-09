import assets from '@/assets';
import { cn } from '@/lib/utils';
import { Outlet } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

const images = [
  {
    image: assets.authside1,
    title: 'Verified Homes',
    description:
      'We only allow uploads from authenticated property owners and registered developers. Every listing is manually verified for legitimacy and accuracy.',
  },
  {
    image: assets.authside2,
    title: 'Built for Buyers & Investors',
    description:
      'Whether you’re looking for your next home, scouting investment properties, or sourcing deals for clients — this platform gives you the edge.',
  },
  {
    image: assets.authside3,
    title: 'Exclusive Access for Subscribers',
    description:
      'Only paying subscribers can view full property details, see contact information, and message sellers directly. No distractions — just serious buyers and agents.',
  },
];

const AuthLayout = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-switch every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle transition state for smooth animations
  useEffect(() => {
    setIsTransitioning(true);
    const timeout = setTimeout(() => setIsTransitioning(false), 100);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  const handleManualSwitch = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left side - content area */}
      <div className="flex flex-1 flex-col">
        <Outlet />
      </div>

      {/* Right side - image and info */}
      <div className="hidden flex-col overflow-hidden bg-[oklch(0.7665_0.1393_91.15_/_10%)] lg:flex lg:w-[512px]">
        <div className="flex h-full flex-col items-start gap-10">
          {/* Image container with fade transition */}
          <div className="relative min-h-[599px] w-full overflow-hidden">
            <img
              className={cn(
                'h-auto min-h-[599px] w-full transform object-cover transition-all duration-700 ease-in-out',
                isTransitioning ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
              )}
              src={images[activeIndex].image}
              width={512}
              height={599}
              alt={images[activeIndex].title}
            />
          </div>

          {/* Content area with slide-up animation */}
          <div className="flex flex-col items-start gap-[22px] self-stretch px-8">
            <h4
              className={cn(
                'text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]',
                'transform transition-all duration-500 ease-out',
                isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
              )}
            >
              {images[activeIndex].title}
            </h4>

            <p
              className={cn(
                'text-[16px] leading-[22px] tracking-[-0.01em] text-[#41415A]',
                'transform transition-all delay-100 duration-500 ease-out',
                isTransitioning ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
              )}
            >
              {images[activeIndex].description}
            </p>
          </div>

          {/* Progress indicators with smooth transitions */}
          <div className="flex w-full items-center gap-2 px-8">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => handleManualSwitch(index)}
                className={cn(
                  'h-2 cursor-pointer rounded-none transition-all duration-500 ease-out',
                  'hover:scale-105 active:scale-95',
                  index === activeIndex
                    ? 'w-[63.67px] bg-[#D4AF36] shadow-lg'
                    : 'w-[63.67px] bg-[#EFE1B5] hover:bg-[#E8D89F]'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
