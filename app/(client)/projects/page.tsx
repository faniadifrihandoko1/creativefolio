
import Header from "@/app/components/Fragements/Header";
import { Silkscreen } from "next/font/google";
import React from "react";

import ProjectCard from "@/app/components/Fragements/ProjectCard";
import { Metadata } from "next";

const fontLogo = Silkscreen({ weight: "400", subsets: ["latin"] });

interface Technology {
  name: string;
  color: string;
}

interface Project {
  image: string;
  title: string;
  date: string;
  description: string;
  technologies: Technology[];
  url: string;
}

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

const dummyProjects: Project[] = [
  {
    image: "/images/circle.jpg",
    title: "Circle App",
    date: "June 2024",
    description:
      "Circle is a web-based social media application inspired by Twitter (now X). It allows users to create, delete, and reply to posts, like and dislike content, follow and unfollow users, search for users, and share thread links.",
    technologies: [
      { name: "Typecript", color: " bg-orange-500" },
      { name: "EXPRESSJS", color: "bg-gray-600" },
      { name: "PostgreSQL", color: "bg-red-600" },
      { name: "TAILWINDCSS", color: "bg-green-600" },
      { name: "REACTJS", color: "bg-blue-500" },
      { name: "CHAKRAUI", color: "bg-yellow-600" },
    ],
    url: "https://github.com/faniadifrihandoko1/fe-threads",
  },
  {
    image: "/images/portofolio.jpg",
    title: "Portfolio Website",
    date: "May 2024",
    description:
      "A professional portfolio site showcasing projects, skills, and work experience, built with ReactJS, TailwindCSS, and Framer Motion for a smooth, responsive user experience with engaging animations.",
    technologies: [
      { name: "REACTJS", color: "bg-blue-600" },
      { name: "TAILWINDCSS", color: "bg-green-600" },
      { name: "FRAMER MOTION", color: "bg-purple-600" },
      { name: "SANITY", color: "bg-orange-500" },
    ],
    url: "https://fanidev.vercel.app/",
  },
  {
    image: "/images/micro-feature.jpg",
    title: "Micro Feature",
    date: "Jan 2024",
    description:
      "Micro Feature is an interactive application packed with various tools and games. Its features include a Tic-Tac-Toe game, Mobile Legends hero search, duration counter, currency converter, salary calculator, and word scrambler. This app is designed to provide a user-friendly and engaging experience.",
    technologies: [
      { name: "TypeScript", color: "bg-indigo-500" },
      { name: "ReactJS", color: "bg-blue-600" },
      { name: "TailwindCSS", color: "bg-teal-500" },
      { name: "React Query", color: "bg-pink-500" },
      { name: "Formik", color: "bg-purple-600" },
    ],
    url: "https://micro-feature-by-fani.vercel.app/",
  },
];

const Projects: React.FC = () => {
  return (
    <div className="w-full  pt-28  px-6 md:px-0">
      <Header
        title="Project"
        description="A list of all my personal projects"
      />
      <div className="flex flex-col h-full mt-5 gap-6 md:gap-4">
        {dummyProjects?.map((project, index) => (
          <ProjectCard
            key={index}
            image={project.image}
            title={project.title}
            date={project.date}
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
