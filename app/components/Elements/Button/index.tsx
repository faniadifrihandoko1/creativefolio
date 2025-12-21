"use client";
import React from "react";

interface Props {
  type?: "button" | "submit" | "reset";
  onclick?: () => void;
  classname?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

function Button({
  type = "button",
  onclick,
  classname,
  children,
  disabled = false,
}: Props) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (onclick && !disabled) {
      onclick();
    }
  };

  return (
    //  button
    <button
      type={type}
      onClick={handleClick}
      className={classname}
      disabled={disabled}
      aria-label="Toggle navigation menu"
    >
      {children}
    </button>
  );
}

export default Button;
