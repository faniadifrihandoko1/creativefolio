import { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Fragements/Footer";
import { FaArrowRight } from "react-icons/fa";

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
    <div className="w-full pt-28 px-6 md:px-0">
      {/* Hero — full height di mobile, konten di tengah vertikal */}
      <section className="mx-auto max-w-3xl text-center mb-24 min-h-[calc(100svh-7rem)] flex flex-col justify-center lg:min-h-0">
        <p
          className="text-3xl md:text-4xl inline-block animate-wave"
          style={{ transformOrigin: "70% 70%" }}
        >
          👋
        </p>
        <h1 className="text-lg md:text-xl font-extrabold mt-3">
          Holla! I am Fani Adi Frihandoko,
        </h1>
        <p className="font-extrabold text-4xl md:text-5xl lg:text-6xl mt-2">
          [ Frontend Developer ]
        </p>
        <p className="text-base md:text-lg mt-5 text-gray-700 dark:text-gray-300">
          As a digital architect, I&apos;m ready to transform my imagination
          into virtual worlds. Let&apos;s bring your ideas to life with
          captivating digital experiences!
        </p>
        <div className="flex flex-wrap gap-3 mt-7 justify-center">
          <Link
            href="/projects"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
          >
            Lihat Projects
            <FaArrowRight className="text-sm" />
          </Link>
          <Link
            href="/blogs"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Baca Blog
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
