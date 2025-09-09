import { useState, useEffect } from 'react';

const LoadingFallback = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // Simulate realistic loading with variable speed
        const increment = Math.random() * 15 + 5;
        return Math.min(prev + increment, 100);
      });
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex min-h-[500px] w-full items-center justify-center bg-white">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 text-center">
        {/* Icon */}
        <svg width="32" height="41" viewBox="0 0 32 41" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.2793 10.16C8.2793 9.94306 8.45514 9.76721 8.67206 9.76721H10.6754C10.8923 9.76721 11.0681 9.94306 11.0681 10.16V16.0036H8.2793V10.16Z"
            fill="#D4AF36"
          />
          <path
            d="M15.248 8.77054C15.6839 8.40982 16.3151 8.40982 16.751 8.77054L25.2959 15.8428L16.0156 25.1241L11.7598 20.8682C11.6064 20.7149 11.3584 20.7148 11.2051 20.8682L9.4541 22.6182C9.30085 22.7716 9.30084 23.0205 9.4541 23.1739L15.2188 28.9385C15.5255 29.2452 16.0233 29.2452 16.3301 28.9385L27.3896 17.878V29.3575C27.3895 31.0926 25.9823 32.5 24.2471 32.5H7.75195C6.01673 32.5 4.60952 31.0926 4.60938 29.3575V17.5752L15.248 8.77054Z"
            fill="#D4AF36"
          />
        </svg>

        {/* Title */}
        <div className="flex flex-col items-center gap-6 self-stretch">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-[24px] leading-[29px] font-semibold tracking-[-0.02em] text-[#1F2130]">Almost there</h2>
            <p className="text-[16px] leading-[22px] tracking-[-0.01em] text-[#41415A]">Building your experience...</p>
          </div>

          {/* Progress Bar */}
          <div className="flex w-full flex-col gap-4">
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="relative h-full rounded-full bg-gradient-to-r from-amber-400 to-[#D4AF36] transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="animate-shimmer absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
            <div className="text-center text-xs text-gray-500">{Math.round(progress)}%</div>
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 animate-bounce rounded-full bg-[#D4AF36]"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.6s',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingFallback;
