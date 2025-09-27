"use client";
import Link from "next/link";
import React from "react";
import { TiArrowBack } from "react-icons/ti";

const NavbarCMS = () => {
  return (
    <div className=" flex  flex-row md:justify-between md:items-center px-5 py-3 w-full transition-all duration-300 backdrop-blur-3xl bg-white/10">
      <Link href={"/"}>
        <TiArrowBack size={25} className="hover:text-green-500" />
      </Link>
      <h1 className="text-2xl font-extrabold text-indigo-950 dark:text-bgBody">
        Fan<span className="text-green-500">dev.</span>
      </h1>
    </div>
  );
};

export default NavbarCMS;
