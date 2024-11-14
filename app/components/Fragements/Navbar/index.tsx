"use client";
import { Silkscreen } from "next/font/google";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Button from "../../Elements/Button";
import ThemeSwitch from "../ThemeSwitch";
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

    // Set the initial value
    updateTarget();

    return () => window.removeEventListener("resize", updateTarget);
  }, [width]);

  return targetReached;
};
const Navbar = ({ isOpen, setIsOpen }: Props) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useMediaQuery(768); // md breakpoint is typically 768px

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 py-5  right-0 z-10 transition-all w-full duration-300  ${
        isScrolled
          ? "bg-white/10 backdrop-blur-2xl shadow-md"
          : "bg-transparent"
      } ${
        isOpen
          ? "bg-bgBody backdrop-blur-3xl dark:bg-slate-950 shadow-lg  "
          : "h-auto"
      }`}
    >
      <div className="mx-auto w-full px-6 md:px-32 py-1">
        <div className="flex justify-between items-center    w-full">
          <div className="">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <h1
                className={`${fontLogo.className} text-3xl  font-extrabold text-indigo-950 dark:text-bgBody`}
              >
                Fani<span className="text-green-500">Dev.</span>
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Navlist dekstop*/}
            <NavList
              items={navItems}
              onItemClick={toggleMenu}
              className={`md:flex gap-4 text-lg ${
                isOpen ? "block" : "hidden"
              } md:block hidden`}
            />
            <ThemeSwitch />
            <Button classname="md:hidden " onclick={toggleMenu}>
              {/* Hamburger icon */}
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                ></path>
              </svg>
            </Button>
          </div>
        </div>
        {/* Mobile  navbar */}
        {isOpen && (
          <div className="md:hidden my-4">
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
