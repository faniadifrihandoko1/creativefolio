import { Metadata } from "next";
import { AboutView } from "@/app/components/view/(client)/about";

export const metadata: Metadata = {
  title: "About | Fani Adi Frihandoko",
  description:
    "Learn more about Fani Adi Frihandoko, a Frontend Developer from Depok, Indonesia.",
  keywords:
    "Frontend Developer, ReactJS, NextJS, TypeScript, TailwindCSS, Redux, Depok, Indonesia",
  openGraph: {
    title: "About | Fani Adi Frihandoko",
    description:
      "Learn more about Fani Adi Frihandoko, a Frontend Developer from Depok, Indonesia.",
    type: "website",
  },
};

const About = () => {
  return <AboutView />;
};

export default About;
