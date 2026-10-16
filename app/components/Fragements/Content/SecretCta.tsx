import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";

const SecretCta = () => {
  return (
    <div className="flex flex-wrap gap-3 mt-8 justify-center px-4">
      <Link
        href="/blogs"
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
      >
        Lihat Blog
        <FaArrowRight className="text-sm" />
      </Link>
      <Link
        href="/projects"
        className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        Lihat Project
      </Link>
    </div>
  );
};

export default SecretCta;
