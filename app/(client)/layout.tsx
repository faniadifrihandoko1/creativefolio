"use client";
import type { Metadata } from "next";
import { Fira_Code, Poppins, Berkshire_Swash } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Fragements/Navbar";
import Provide from "../utils/Provider";
import React from "react";
import Footer from "../components/Fragements/Footer";

const inter = Poppins({ subsets: ["latin"], weight: "500" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <html lang="en">
      <body
        className={`${inter.className} h-full bg-bgBody text-indigo-950 dark:bg-slate-950 dark:text-amber-50 dark:selection:bg-purple-500 `}
      >
        <Provide>
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
          <main
            className={`mx-auto  ${
              isOpen ? "backdrop-filter blur" : ""
            }  max-w-5xl  `}
          >
            {children}
            <Footer />
          </main>
        </Provide>
      </body>
    </html>
  );
}
