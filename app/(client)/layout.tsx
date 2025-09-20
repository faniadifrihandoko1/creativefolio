"use client";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import Footer from "../components/Fragements/Footer";
import Navbar from "../components/Fragements/Navbar";
import Provide from "../utils/Provider";
import "./globals.css";

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
        className={`${inter.className} min-h-screen bg-bgBody text-indigo-950 dark:bg-slate-950 dark:text-amber-50 dark:selection:bg-purple-500`}
      >
        <Provide>
          <NextTopLoader />
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
          <main
            className={`mx-auto ${
              isOpen ? "backdrop-filter blur" : ""
            } max-w-5xl`}
          >
            {children}
          </main>
        </Provide>
      </body>
    </html>
  );
}
