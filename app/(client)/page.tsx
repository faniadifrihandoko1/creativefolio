import { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Fragements/Footer";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

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

const SKILLS = [
  "ReactJS",
  "React Native",
  "NextJS",
  "TypeScript",
  "TanStack Start",
  "ExpressJS",
  "TailwindCSS",
  "PostgreSQL",
];

export default function Home() {
  return (
    <div className="w-full pt-28 px-6 md:px-0">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center mb-24">
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

      {/* Skills */}
      <section className="mx-auto max-w-3xl mb-24 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Tech I Use</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full border border-gray-200 dark:border-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl mb-24 text-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Tertarik kerja sama?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
          Saya terbuka untuk proyek freelance, kolaborasi, atau sekadar ngobrol
          soal teknologi. Jangan ragu untuk menghubungi saya!
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a
            href="mailto:faniadifrihandoko1@gmail.com"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
          >
            <MdEmail size={20} />
            Kirim Email
          </a>
          <a
            href="https://github.com/faniadifrihandoko1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FaGithub size={20} />
            GitHub
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
