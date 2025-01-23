import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { CgMail } from "react-icons/cg";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaReact,
  FaSpotify,
} from "react-icons/fa";
import { RiNextjsFill, RiTailwindCssFill } from "react-icons/ri";
import { SiRedux, SiTypescript } from "react-icons/si";
import profile from "../../asset/profile.png";

const About = () => {
  return (
    <div className="mx-auto mb-12 pt-28  px-6 md:px-0  grid w-full grid-cols-1 justify-center gap-y-8 space-y-10  lg:max-w-5xl lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-20">
      <div className="lg:pl-32 xl:pl-36 max-w-xs mx-auto px-2.5  lg:max-w-none pr-10">
        <Image
          src={profile}
          alt="profile"
          className="aspect-square rotate-2 rounded-2xl transition duration-1000 scale-100 blur-0 grayscale-0 shadow-lg shadow-emerald-950 drop-shadow-2xl dark:shadow-teal-900 dark:drop-shadow-2xl dark:backdrop-contrast-200 dark:shadow-2xl object-cover backdrop-contrast-200 "
        />
      </div>
      <div className="lg:order-first lg:row-span-2">
        <div className=" pointer-events-auto transform-none">
          <h1 className="font-newsreader text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl lg:mb-16 lg:mt-10">
            I,m &nbsp;
            <span className="text-teal-700 dark:text-teal-400">
              Fani Adi Frihandoko
            </span>
            , a Frontend Developer from Depok, Indonesia.
          </h1>
        </div>
        <div className="pt-12 text-base">
          <section className="space-y-12 md:space-y-16">
            <div className="pointer-events-auto transform-none">
              <h2 className="mb-3 font-newsreader text-xl font-bold lg:mb-5 lg:text-2xl">
                Who am I?
              </h2>
              <p className="font-normal lg:text-lg mb-4">
                I am a passionate and adaptable Frontend Developer, a graduate
                in Informatics Engineering from &nbsp;
                <a href="https://nurulfikri.ac.id/" className="underline">
                  STT Terpadu Nurul Fikri
                </a>
                . With a strong foundation in web technologies, I am committed
                to continuous learning and skill development. I enjoy exploring
                new technologies and integrating innovative ideas into
                application development.
              </p>
              <p className="font-normal lg:text-lg">
                With expertise in <b>ReactJS</b>, <b>NextJS</b>, and{" "}
                <b>ExpressJS</b>, I am skilled in building innovative, reliable,
                scalable, and efficient applications that deliver exceptional
                user experiences.
              </p>
            </div>

            <div className="pointer-events-auto transform-none">
              <h2 className="mb-8 font-newsreader text-xl font-bold lg:mb-10 lg:text-2xl">
                What am I using?
              </h2>
              <div className="mx-2 inline-flex  w-full flex-nowrap overflow-hidden py-8 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
                <Marquee gradient={false} pauseOnHover>
                  <FaReact
                    href="https://react.dev/"
                    className="text-5xl hover:text-green-800 cursor-pointer mx-7"
                    data-tooltip-id="my-tooltip"
                    data-tooltip-content="Hello to you too!"
                  />
                  <SiTypescript
                    className="text-5xl hover:text-green-800 cursor-pointer mx-7"
                    data-tooltip-id="TypeScript"
                  />
                  <RiTailwindCssFill
                    className="text-5xl hover:text-green-800 cursor-pointer mx-7"
                    data-tooltip-id="TailwindCSS"
                  />
                  <RiNextjsFill
                    className="text-5xl hover:text-green-800 cursor-pointer mx-7"
                    data-tooltip-id="NextJS"
                  />
                  <SiRedux
                    className="text-5xl hover:text-green-800 cursor-pointer mx-7"
                    data-tooltip-id="Redux"
                  />
                </Marquee>
              </div>
            </div>
            <div className="pointer-events-auto transform-none">
              <h2 className="mb-8 font-newsreader text-xl font-bold lg:mb-10 lg:text-2xl">
                Where have I worked?
              </h2>
              <div>
                <ol className="py-8 md:py-12">
                  <li>
                    <div className="space-y-3">
                      <p className=" text-sm font-normal text-slate-500 dark:text-slate-400 lg:text-base">
                        {/* I’m currently a Frontend Developer at PT Nizom Berkah
                        Informasi, building intuitive and responsive web
                        applications. */}
                        Hmm, i haven't worked anywhere yet :(
                      </p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
            <div className="pointer-events-auto transform-none">
              <div className="rounded-lg transition-colors duration-500">
                <div className="mb-4 flex items-center gap-2">
                  <FaSpotify />
                  <h1 className="text-sm font-bold lg:text-lg">Spotify</h1>
                </div>
                <div
                  className="flex flex-row justify-between justify-items-start gap-6 rounded-lg bg-gray-100 drop-shadow-md dark:bg-gray-800"
                  style={{
                    backgroundImage:
                      "https://i.scdn.co/image/ab67616d0000b2736382f06498259682f91cf981",
                  }}
                >
                  <div className="flex h-full w-full flex-row items-center justify-between rounded-lg bg-teal-900 bg-opacity-60 px-4 py-4 md:px-6 md:py-6">
                    <div>
                      <h1 className="mb-1 line-clamp-1 items-center justify-self-center pt-2 text-sm font-bold text-gray-200 lg:text-lg">
                        The Scientist
                      </h1>
                      <h2 className="mb-2 line-clamp-1 items-center justify-center text-sm font-medium text-gray-300 lg:text-base">
                        Coldplay
                      </h2>
                    </div>
                    <div>
                      <a href="https://open.spotify.com/track/75JFxkI2RXiU7L9VXzMkle?si=9fc829262cee463b">
                        <Image
                          alt="Last Played"
                          loading="lazy"
                          width={100}
                          height={100}
                          decoding="async"
                          data-nimg="1"
                          className="bg-transparent rounded-lg shadow-lg filter transition-all duration-300 hover:shadow-xl hover:brightness-75 hover:saturated-125 hover:drop-shadow-md"
                          src="/images/the-scientis.jpg" // Corrected path
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="lg:pl-32 flex flex-col gap-7">
        <Link
          href={"https://linkedin.com/in/faniadifrihandoko"}
          className="flex r items-center gap-5 hover:text-green-600 cursor-pointer"
        >
          <FaLinkedin size={25} />
          <p>LinkedIn</p>
        </Link>
        <div className="flex r items-center gap-5 hover:text-green-600 cursor-pointer">
          <FaGithub size={25} />
          <p>Github</p>
        </div>
        <div className="flex r items-center gap-5 hover:text-green-600 cursor-pointer">
          <FaFacebook size={25} />
          <p>Facebook</p>
        </div>
        <div className="flex r items-center gap-5 hover:text-green-600 cursor-pointer">
          <CgMail size={25} />
          <p>Email</p>
        </div>
      </div>
    </div>
  );
};

export default About;
