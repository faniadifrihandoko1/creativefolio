import { Metadata } from "next";
import ContactInfo from "../components/Fragements/Content/ContactInfo";
import Description from "../components/Fragements/Content/Description";
import Footer from "../components/Fragements/Footer";
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
    <div className="h-screen flex flex-col pt-20">
      <div className="flex-1 flex flex-col items-center justify-center font-extrabold">
        <Header />
        <Tittle />
        <Description />
        <ContactInfo />
      </div>
      <Footer />
    </div>
  );
}
