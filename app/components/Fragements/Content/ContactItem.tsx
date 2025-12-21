"use client";
import Link from "next/link";
import React from "react";

interface Props {
  icon: React.ReactNode;
  text: string;
  link: string;
}
const ContactItem = ({ icon, text, link }: Props) => {
  return (
    <Link
      href={link}
      className="border flex gap-1 justify-center items-center border-slate-950 dark:border-bgBody p-1 hover:bg-neutral-400"
    >
      {/* start contact item */}
      {/* start icon */}
      {icon}
      {/* end icon */}
      {/* start text */}
      <p>{text}</p>
      {/* end contact item */}
    </Link>
  );
};

export default ContactItem;
