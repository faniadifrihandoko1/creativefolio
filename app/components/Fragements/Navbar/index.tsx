"use client";
import { Silkscreen } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ThemeSwitch from "../ThemeSwitch";
import HamburgerButtonNoSSR from "./HamburgerButtonNoSSR";
import NavList from "./NavList";

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const fontLogo = Silkscreen({ weight: "400", subsets: ["latin"] });

const useMediaQuery = (width: number) => {
  const [targetReached, setTargetReached] = useState(false);

  useEffect(() => {
    const updateTarget = () => {
      setTargetReached(window.innerWidth <= width);
    };

    window.addEventListener("resize", updateTarget);
    updateTarget();

    return () => window.removeEventListener("resize", updateTarget);
  }, [width]);

  return targetReached;
};

const Navbar = ({ isOpen, setIsOpen }: Props) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery(768);

  const navItems = [
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Blogs", path: "/blogs" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 py-5 right-0 z-10 transition-all w-full duration-300 ${
        isScrolled
          ? "bg-white/10 backdrop-blur-2xl shadow-md"
          : "bg-transparent"
      } ${
        isOpen
          ? "bg-bgBody backdrop-blur-3xl dark:bg-slate-950 shadow-lg"
          : "h-auto"
      }`}
    >
      <div className="mx-auto w-full px-6 md:px-32 py-1">
        <div className="flex justify-between items-center w-full">
          <div className="">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <h1
                className={`${fontLogo.className} text-3xl font-extrabold text-indigo-950 dark:text-bgBody`}
              >
                Fani<span className="text-green-500">Dev.</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NavList
              items={navItems}
              onItemClick={toggleMenu}
              className={`md:flex gap-4 text-lg ${
                isOpen ? "block" : "hidden"
              } md:block hidden`}
            />
            <ThemeSwitch />
            <HamburgerButtonNoSSR isOpen={isOpen} onClick={toggleMenu} />
          </div>
        </div>
        {/* Mobile navbar */}
        {isOpen && (
          <div className="md:hidden my-4 animate-in slide-in-from-top-2 duration-200">
            <NavList
              items={navItems}
              onItemClick={() => setIsOpen(false)}
              isMobile={isMobile}
              className="flex flex-col gap-3 text-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
