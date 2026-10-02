import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import profile from "@/images/profile.png";
import Footer from "../components/Fragements/Footer";
import { client } from "@/sanity/lib/client";
import { projectsQuery, type SanityProject } from "@/sanity/lib/queries";
import { FaArrowRight, FaGithub, FaLink } from "react-icons/fa";
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
  robots: {
    index: false,
    follow: false,
  },
};

export const revalidate = 60;

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

export default async function Home() {
  const projects = await client.fetch<SanityProject[]>(projectsQuery);
  const featuredPool = projects.filter((p) => p.featured);
  const featured = (featuredPool.length > 0 ? featuredPool : projects).slice(
    0,
    3
  );

  return (
    <div className="w-full pt-28 px-6 md:px-0">
      {/* Hero */}
      <section className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-24">
        <div className="text-center lg:text-left">
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
          <div className="flex flex-wrap gap-3 mt-7 justify-center lg:justify-start">
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
        </div>
        <div className="max-w-xs mx-auto lg:max-w-none px-2.5">
          <Image
            src={profile}
            alt="Fani Adi Frihandoko"
            className="aspect-square rotate-2 rounded-2xl object-cover shadow-lg shadow-emerald-950 drop-shadow-2xl dark:shadow-teal-900"
            priority
          />
        </div>
      </section>

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-5xl mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">
              Featured Projects
            </h2>
            <Link
              href="/projects"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Lihat semua
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((project) => (
              <article
                key={project._id}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                {project.imageUrl && (
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.imageAlt || project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech.name}
                          className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                        >
                          {tech.name}
                        </span>
                      ))}
                    </div>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Buka ${project.title}`}
                        className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <FaLink />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="mx-auto max-w-5xl mb-24 text-center">
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
      <section className="mx-auto max-w-5xl mb-24">
        <div className="relative overflow-hidden text-center rounded-2xl px-6 py-14 bg-[#1e1b4b]">
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-green-400/20 blur-3xl"
            aria-hidden
          />
          <div
            className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">
              Mari terhubung
            </p>
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-white">
              Tertarik kerja sama?
            </h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Saya terbuka untuk proyek freelance, kolaborasi, atau sekadar
              ngobrol soal teknologi. Jangan ragu untuk menghubungi saya!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="mailto:faniadifrihandoko1@gmail.com"
                className="flex items-center gap-2 px-6 py-3 bg-green-400 hover:bg-green-300 text-[#1e1b4b] rounded-lg font-semibold transition-colors shadow-lg"
              >
                <MdEmail size={20} />
                Kirim Email
              </a>
              <a
                href="https://github.com/faniadifrihandoko1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                <FaGithub size={20} />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
