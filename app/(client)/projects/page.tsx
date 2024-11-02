import Header from "@/app/components/Fragements/Header";
import { Silkscreen } from "next/font/google";
import React from "react";

import ProjectCard from "@/app/components/Fragements/ProjectCard";

export const fontLogo = Silkscreen({ weight: "400", subsets: ["latin"] });

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
}

const dummyProjects: Project[] = [
  {
    image: "/images/circle.jpg",
    title: "Circle App",
    date: "June 2024",
    description:
      "Circle is a web-based social media application inspired by Twitter (now X). It allows users to create, delete, and reply to posts, like and dislike content, follow and unfollow users, search for users, and share thread links.",
    technologies: [
      { name: "NEXTJS", color: "bg-gray-600" },
      { name: "TAILWINDCSS", color: "bg-green-600" },
      { name: "SANITY", color: "bg-orange-500" },
    ],
  },
  {
    image: "/images/portofolio.jpg",
    title: "Portfolio Website",
    date: "May 2024",
    description:
      "A personal portfolio website to showcase my projects, skills, and experience.",
    technologies: [
      { name: "REACTJS", color: "bg-blue-600" },
      { name: "TAILWINDCSS", color: "bg-green-600" },
      { name: "FRAMER MOTION", color: "bg-purple-600" },
    ],
  },
  // Tambahkan lebih banyak proyek jika diperlukan
];

const Projects: React.FC = () => {
  return (
    <div className="w-full  pt-28  px-6 md:px-0">
      <Header
        title="Project"
        description="A list of all my personal projects"
      />
      <div className="flex flex-col h-full mt-5 gap-6 md:gap-4">
        {dummyProjects.map((project, index) => (
          <ProjectCard
            key={index}
            image={project.image}
            title={project.title}
            date={project.date}
            description={project.description}
            technologies={project.technologies}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
