import Image from "next/image";
import Link from "next/link";
import { FaClock, FaTag, FaUser } from "react-icons/fa";

import type { SanityPost } from "@/sanity/lib/queries";

export const RelatedArticles = ({ posts }: { posts: SanityPost[] }) => {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Artikel Terkait
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((blog) => (
          <article
            key={blog._id}
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="relative h-40 overflow-hidden">
              <Image
                src={blog.coverUrl ?? "/images/portofolio.jpg"}
                alt={blog.coverAlt || blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <FaTag className="text-blue-500 shrink-0" />
                  {blog.category}
                </span>
                <span className="flex items-center gap-1.5 whitespace-nowrap">
                  <FaClock className="shrink-0" />
                  {blog.readTime}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {blog.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <FaUser />
                  <span>{blog.author}</span>
                </div>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition-colors duration-200"
                >
                  Read More
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
