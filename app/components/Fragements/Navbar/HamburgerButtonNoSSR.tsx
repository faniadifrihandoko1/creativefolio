"use client";
import React from "react";
import Button from "../../Elements/Button";
import { NoSSR } from "../../NoSSR";

interface HamburgerButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

const HamburgerButtonComponent: React.FC<HamburgerButtonProps> = ({
  isOpen,
  onClick,
  className = "md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200",
}) => {
  return (
    <Button classname={className} onclick={onClick}>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
        />
      </svg>
    </Button>
  );
};

const HamburgerButtonNoSSR = NoSSR(HamburgerButtonComponent);

export default HamburgerButtonNoSSR;
