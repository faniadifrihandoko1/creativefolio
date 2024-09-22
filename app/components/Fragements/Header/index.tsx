import { Newsreader } from "next/font/google";
import React from "react";

interface PropsHeader {
  title: string;
  description: string;
}
const newsreader = Newsreader({ weight: "700", subsets: ["latin"] });
const Header = ({ title, description }: PropsHeader) => {
  return (
    <header>
      <h1 className={`${newsreader.className} text-4xl font-bold`}>{title}</h1>
      <p className="mt-2">{description}</p>
    </header>
  );
};

export default Header;
