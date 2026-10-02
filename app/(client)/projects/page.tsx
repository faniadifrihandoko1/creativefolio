import Header from "@/app/components/Fragements/Header";
import { Silkscreen } from "next/font/google";
import React from "react";

import ProjectCard from "@/app/components/Fragements/ProjectCard";
import { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { projectsQuery, type SanityProject } from "@/sanity/lib/queries";

const fontLogo = Silkscreen({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Projects | Fani Adifrihandoko",
  description:
    "Explore a list of personal projects by Fani Adifrihandoko, including web applications, tools, and interactive experiences.",
  keywords: [
    "Fani Adifrihandoko",
    "portfolio",
    "projects",
    "web development",
    "ReactJS",
    "TypeScript",
    "TailwindCSS",
  ],
  authors: [{ name: "Fani Adifrihandoko" }],
  openGraph: {
    title: "Projects | Fani Adifrihandoko",
    description:
      "Explore a list of personal projects by Fani Adifrihandoko, including web applications, tools, and interactive experiences.",
    images: "/images/portofolio.jpg",
    type: "website",
    url: "https://fanidev.vercel.app/projects",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Fani Adifrihandoko",
    description:
      "Explore a list of personal projects by Fani Adifrihandoko, including web applications, tools, and interactive experiences.",
    images: "/images/portofolio.jpg",
  },
};

export const revalidate = 60;

/** Placeholder kalau proyek belum punya gambar. */
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300"><rect width="500" height="300" fill="#1e1b4b"/><text x="250" y="160" font-family="sans-serif" font-size="28" fill="#4ade80" text-anchor="middle">FANIDEV</text></svg>`
  );

/** "2024-06-01" -> "June 2024" */
function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

const Projects = async () => {
  const projects = await client.fetch<SanityProject[]>(projectsQuery);

  return (
    <div className="w-full  pt-28  px-6 md:px-0">
      <Header title="Project" description="A list of all my personal projects" />
      <div className="flex flex-col h-full my-5 gap-6 md:gap-4">
        {projects?.map((project) => (
          <ProjectCard
            key={project._id}
            image={project.imageUrl || PLACEHOLDER_IMAGE}
            title={project.title}
            date={formatDate(project.date)}
            description={project.description}
            technologies={project.technologies}
            url={project.url}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
