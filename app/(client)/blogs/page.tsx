import Header from "@/app/components/Fragements/Header";
import { FaRegFolderOpen } from "react-icons/fa";

const Blogs = () => {
  return (
    <div className="w-full h-screen pt-28  px-6 md:px-0 ">
      <Header
        title="Blog"
        description="I write about software development, productivity, and other topics that interest me."
      />
      {/* <div className="btn mt-5 flex gap-3">
        <Button classname="text-sm border-2 border-zinc-600 rounded-sm shadow-sm px-3 py-1 dark:bg-gray-500 bg-neutral-200">
          ReactJS
        </Button>
        <Button classname="text-sm border-2 border-zinc-600 rounded-sm shadow-sm px-3 py-1 dark:bg-gray-500 bg-neutral-200">
          ReactJS
        </Button>
        <Button classname="text-sm text-white dark:text-slate-700 rounded-sm shadow-sm px-3 py-1 dark:bg-zinc-300 bg-green-700">
          +9 More
        </Button>
         <Button classname="text-sm text-white dark:text-slate-700 rounded-sm shadow-sm px-3 py-1 dark:bg-zinc-300 bg-green-700">
          +9 More
        </Button>
      </div> */}
      <hr className="border-1.5 border-black dark:border-white mt-7" />
      <div className="mt-10 md:mt-32 flex flex-col items-center justify-center text-center">
        <FaRegFolderOpen className="text-6xl text-gray-400 dark:text-gray-600" />
        <h3 className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-400">
          No articles available yet
        </h3>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Please come back later to read the latest articles.
        </p>
      </div>
    </div>
  );
};

export default Blogs;
