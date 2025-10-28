import assets from '@/assets';
import { Link } from '@tanstack/react-router';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="flex flex-col border-t border-[#202026]">
      <div className="box-border flex flex-col items-center bg-[#21242E] pt-16 pb-12 md:pt-[88px] md:pb-[74px]">
        <div className="landing-container flex w-full flex-col items-start justify-center gap-8 px-4 md:gap-10 md:px-0">
          <div className="flex flex-col items-start gap-6 self-stretch md:gap-7">
            {/* Header Section */}
            <div className="flex w-full flex-col gap-6 md:grid md:grid-cols-5 md:gap-36">
              <h1 className="text-3xl leading-tight font-semibold tracking-[-0.02em] text-[#D4AF36] md:col-span-2 md:text-[48px] md:leading-[57px]">
                Get in Touch
              </h1>

              <div className="flex items-start gap-8 md:col-span-2 md:grow md:items-center md:gap-10">
                <Link
                  to="/about"
                  className="text-[16px] leading-[19px] font-semibold text-white [&.active]:font-semibold [&.active]:text-[#D4AF36]"
                  activeProps={{
                    className: 'text-[14px] leading-[13px] font-semibold text-[#D4AF36]',
                  }}
                >
                  About Us
                </Link>

                <Link
                  to="/contact"
                  className="text-[16px] leading-[19px] font-semibold text-white [&.active]:font-semibold [&.active]:text-[#D4AF36]"
                  activeProps={{
                    className: 'text-[14px] leading-[13px] font-semibold text-[#D4AF36]',
                  }}
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Contact Information */}
            <div className="flex w-full flex-col gap-8 md:grid md:grid-cols-5 md:gap-36">
              {/* Phone and Address */}
              <div className="flex flex-col gap-4 text-white md:col-span-2 md:gap-3">
                <h6 className="text-[12px] text-gray-300 uppercase">PHONE</h6>
                <div className="flex flex-col text-[16px] leading-relaxed">
                  <span>+234 907 004 5555</span>
                  <span>+234 907 004 2222</span>
                </div>

                <p className="mt-2 text-[16px] leading-relaxed">
                  Plot 8, Block A9, Wole Olateju Crescent, Off Admiralty Way Eti-Osa, Lekki Phase 1
                </p>
              </div>

              {/* Email and Social */}
              <div className="flex flex-col gap-4 text-white md:col-span-2 md:gap-3">
                <h6 className="text-[12px] text-gray-300 uppercase">EMAIL</h6>
                <div className="flex flex-col text-[16px] leading-relaxed">
                  <span className="font-semibold">support@nigeriapropertyhub.com</span>
                </div>

                <div className="mt-6 flex items-center gap-4 md:mt-8">
                  <Facebook className="size-5 cursor-pointer text-white transition-colors hover:text-[#D4AF36] md:size-4" />
                  <Twitter className="size-5 cursor-pointer text-white transition-colors hover:text-[#D4AF36] md:size-4" />
                  <Linkedin className="size-5 cursor-pointer text-white transition-colors hover:text-[#D4AF36] md:size-4" />
                  <Instagram className="size-5 cursor-pointer text-white transition-colors hover:text-[#D4AF36] md:size-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full bg-[#171A24] py-8 md:py-12">
        <div className="landing-container flex w-full flex-col items-start gap-6 self-stretch px-4 md:flex-row md:items-center md:gap-[33px] md:px-0">
          <div className="flex w-full items-center justify-between gap-4 self-stretch md:justify-between md:gap-[33px]">
            <div>
              <img
                src={assets.footerlogo}
                alt="Geoplox Logo"
                width={126}
                height={40}
                className="h-8 w-auto md:h-10 md:w-[126px]"
              />
              <span className="mt-4 text-[14px] leading-5 text-[#DDDDDF] md:mt-0">
                © 2025 — Geoplox, All Right Reserved.
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Facebook className="size-5 cursor-pointer text-white transition-colors hover:text-[#D4AF36]" />
              <Twitter className="size-5 cursor-pointer text-white transition-colors hover:text-[#D4AF36]" />
              <Linkedin className="size-5 cursor-pointer text-white transition-colors hover:text-[#D4AF36]" />
              <Instagram className="size-5 cursor-pointer text-white transition-colors hover:text-[#D4AF36]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
