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
    // link dengan icon dan text
    <Link
      href={link}
      className="border flex gap-1 justify-center items-center border-slate-950 dark:border-bgBody p-1 hover:bg-neutral-400"
    >
      {icon} {/* icon dengan size 25 */}
      <p>{text}</p> {/* text dengan font size 14 */}
    </Link>
  );
};

export default ContactItem;
