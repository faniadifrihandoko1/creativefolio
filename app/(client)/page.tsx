import { Metadata } from "next";
import ContactInfo from "../components/Fragements/Content/ContactInfo";
import Description from "../components/Fragements/Content/Description";
import Header from "../components/Fragements/Content/HeaderContent";
import Tittle from "../components/Fragements/Content/TittleContent";

export const metadata: Metadata = {
  title: "Fani Dev",
  description:
    "Portofolio Fani, seorang Frontend Developer dengan pengalaman dalam React, Next.js, TypeScript, dan UI/UX Development.",
  keywords: [
    "Frontend Developer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "UI/UX",
    "Portofolio",
    "Web Developer",
  ],
  openGraph: {
    title: "Fani Dev | Frontend Developer Portfolio",
    description:
      "Portofolio Fani, seorang Frontend Developer dengan pengalaman dalam React, Next.js, TypeScript, dan UI/UX Development.",
    url: "https://fanidev.vercel.app/",
    siteName: "Fani Dev",
  },
};

export default function Home() {
  return (
    <div className="font-extrabold flex flex-col h-screen items-center justify-center ">
      <Header />
      <Tittle />
      <Description />
      <ContactInfo />
    </div>
  );
}
