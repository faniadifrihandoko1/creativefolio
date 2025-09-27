"use client";
import Button from "@/app/components/Elements/Button";
import Image from "next/image";
import Link from "next/link";
import { FaLink } from "react-icons/fa6";

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
  url: string;
}

const ProjectCard = ({
  image,
  title,
  date,
  description,
  technologies,
  url,
}: Project) => {
  return (
    <div className="card flex flex-col md:flex-row gap-1 md:gap-3 shadow-md border-[1px] z-1 rounded-md border-gray-400 md:max-h-[500px] lg:max-h-[600px] overflow-hidden">
      {/* Card Image */}
      <div className="image md:w-1/2 z-0">
        <Image
          src={image}
          width={500}
          height={300}
          alt={`project ${title}`}
          className="w-full h-full"
        />
      </div>
      {/* Card Body */}
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
        <div className="technology flex flex-wrap gap-2 mt-1">
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
          <Link href={url} target="_blank" rel="noopener noreferrer">
            <FaLink size={25} className="cursor-pointer hover:text-green-500 hover:dark:text-green-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
