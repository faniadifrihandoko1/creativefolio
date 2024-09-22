import React from "react";
import Image from "next/image";
import { FaLink } from "react-icons/fa6";
import Button from "@/app/components/Elements/Button";

export interface Technology {
  name: string;
  color: string;
}

export interface Project {
  image: string;
  title: string;
  date: string;
  description: string;
  technologies: Technology[];
}

const ProjectCard = ({
  image,
  title,
  date,
  description,
  technologies,
}: Project) => {
  return (
    <div className="card flex flex-col md:flex-row gap-1 md:gap-3 shadow-md border-[1px] z-50 rounded-md border-gray-400">
      <div className="image md:w-1/2 z-0">
        <Image src={image} width={500} height={300} alt={`project ${title}`} />
      </div>
      <div className="body flex flex-col gap-1 md:gap-2 p-4 md:w-1/2">
        <h1
          className={`text-3xl md:text-4xl font-extrabold text-indigo-950 dark:text-bgBody`}
        >
          {title}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Created at {date}
        </p>
        <p className="desc">{description}</p>
        <div className="technology flex gap-2 mt-1">
          {technologies.map((tech, index) => (
            <Button
              key={index}
              classname={`text-xs ${tech.color} rounded-md p-1 text-white`}
            >
              {tech.name}
            </Button>
          ))}
        </div>
        <div className="visit flex gap-5 mt-3">
          <FaLink size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
