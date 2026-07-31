import { useEffect } from "react";
import Footer from "../footer";
import Topnav from "../topnav";
import { Outlet } from "@tanstack/react-router";

const LandingLayout = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      if (scrollY === 0) {
        // Top → nav color
        document.documentElement.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
      } else if (scrollY + winHeight >= docHeight) {
        // Bottom → footer color
        document.documentElement.style.backgroundColor = "#171A24";
      } else {
        // Middle → neutral or nav color
        document.documentElement.style.backgroundColor = "#ffffff";
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // run once on mount

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="w-full">
      <Topnav />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default LandingLayout;
