"use client";
import Header from "@/app/components/Fragements/Header";
import Button from "@/app/components/Elements/Button";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaTag,
  FaArrowRight,
  FaSearch,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Sample blog data
const sampleBlogs = [
  {
    id: 1,
    title: "Building Modern Web Applications with Next.js 14",
    slug: "building-modern-web-applications-with-nextjs-14",
    excerpt:
      "Discover the latest features in Next.js 14 and how to leverage them for building scalable web applications with improved performance and developer experience.",
    author: "John Doe",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Web Development",
    image: "/images/portofolio.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "The Art of Clean Code: Best Practices for Developers",
    slug: "the-art-of-clean-code-best-practices-for-developers",
    excerpt:
      "Learn essential principles and practices for writing maintainable, readable, and efficient code that stands the test of time.",
    author: "Fani Adi Frihandoko",
    date: "2024-01-10",
    readTime: "6 min read",
    category: "Programming",
    image: "/images/circle.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Design Systems: Creating Consistent User Experiences",
    slug: "design-systems-creating-consistent-user-experiences",
    excerpt:
      "Explore how design systems can help create cohesive, scalable, and maintainable user interfaces across your entire product ecosystem.",
    author: "Fani Adi Frihandoko",
    date: "2024-01-05",
    readTime: "10 min read",
    category: "Design",
    image: "/images/micro-feature.jpg",
    featured: false,
  },
  {
    id: 4,
    title: "Performance Optimization Techniques for React Applications",
    slug: "performance-optimization-techniques-for-react-applications",
    excerpt:
      "Dive deep into advanced React optimization techniques including memoization, code splitting, and bundle analysis to create lightning-fast applications.",
    author: "Sarah Wilson",
    date: "2024-01-01",
    readTime: "12 min read",
    category: "Web Development",
    image: "/images/the-scientis.jpg",
    featured: true,
  },
];

const categories = [
  "All",
  "Web Development",
  "Programming",
  "Design",
  "Productivity",
];

export const BlogsView = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredBlogs = sampleBlogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === "All" || blog.category === selectedCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredBlogs = filteredBlogs.filter((blog) => blog.featured);
  const regularBlogs = filteredBlogs.filter((blog) => !blog.featured);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="w-full min-h-screen pt-28 px-6 md:px-0">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-28 px-6 md:px-0">
      <Header
        title="Blog"
        description="I write about software development, productivity, and other topics that interest me."
      />

      {/* Search and Filter Section */}
      <div className="mt-8 mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                onclick={() => setSelectedCategory(category)}
                classname={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <hr className="border-1.5 border-black dark:border-white mb-12" />

      {/* Featured Articles Section */}
      {featuredBlogs.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaTag className="text-blue-500" />
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {blog.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <FaUser />
                      <span>{blog.author}</span>
                    </div>
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
                    >
                      Read More
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Regular Articles Section */}
      {regularBlogs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularBlogs.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="flex items-center gap-1">
                      <FaTag className="text-blue-500" />
                      {blog.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock />
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
      )}

      {/* No Results State */}
      {filteredBlogs.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-16">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
            <FaSearch className="text-4xl text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            No articles found
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      )}

      {/* Load More Button */}
      {filteredBlogs.length > 0 && (
        <div className="flex justify-center mt-12">
          <Button classname="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  );
};
