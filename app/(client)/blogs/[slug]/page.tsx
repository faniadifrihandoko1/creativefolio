import Header from "@/app/components/Fragements/Header";
import Button from "@/app/components/Elements/Button";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag } from "react-icons/fa";
import Link from "next/link";

interface BlogDetailProps {
  params: {
    slug: string;
  };
}

const BlogDetail = ({ params }: BlogDetailProps) => {
  // Mock data - in real app, you would fetch this based on the slug
  const blogPost = {
    title: "Getting Started with Next.js 14",
    description:
      "Learn the fundamentals of Next.js 14 and build your first application with the latest features and improvements.",
    content: `
      <p>Next.js 14 brings exciting new features and improvements that make building React applications even more powerful and efficient. In this comprehensive guide, we'll explore the key features and how to get started.</p>
      
      <h2>What's New in Next.js 14</h2>
      <p>One of the most significant updates is the introduction of the App Router, which provides a more intuitive and flexible way to organize your application structure. The App Router uses a file-system based routing approach that makes it easier to create nested layouts and handle complex routing scenarios.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li><strong>App Router:</strong> A new routing system that provides better performance and developer experience</li>
        <li><strong>Server Components:</strong> Run components on the server for improved performance</li>
        <li><strong>Streaming:</strong> Progressive loading of page content</li>
        <li><strong>Turbopack:</strong> Faster bundler for development</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>To create a new Next.js 14 project, you can use the create-next-app command with the latest template:</p>
      
      <pre><code>npx create-next-app@latest my-app</code></pre>
      
      <p>This will create a new Next.js project with all the latest features and configurations. The project structure will include the new app directory, which is where you'll organize your routes and layouts.</p>
      
      <h2>Building Your First Page</h2>
      <p>With the App Router, creating pages is as simple as adding a page.tsx file to your app directory. For example, to create a blog page, you would create:</p>
      
      <pre><code>app/blog/page.tsx</code></pre>
      
      <p>This approach makes it easy to organize your application and understand the routing structure at a glance.</p>
      
      <h2>Conclusion</h2>
      <p>Next.js 14 represents a significant step forward in React application development. With its improved performance, better developer experience, and powerful new features, it's an excellent choice for building modern web applications.</p>
    `,
    author: "John Doe",
    publishedAt: "2024-01-15",
    tags: ["Next.js", "React", "Web Development", "Tutorial"],
    readTime: "8 min read",
  };

  return (
    <div className="w-full min-h-screen pt-28 px-6 md:px-0">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/blogs">
          <Button
            classname="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            onclick={() => {}}
          >
            <FaArrowLeft />
            Back to Blogs
          </Button>
        </Link>
      </div>

      {/* Header */}
      <Header title={blogPost.title} description={blogPost.description} />

      {/* Blog Meta Information */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <FaUser />
          <span>{blogPost.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt />
          <span>
            {new Date(blogPost.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>{blogPost.readTime}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {blogPost.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
          >
            <FaTag className="text-xs" />
            {tag}
          </span>
        ))}
      </div>

      <hr className="border-1.5 border-black dark:border-white mt-7" />

      {/* Blog Content */}
      <article className="mt-10 max-w-4xl">
        <div
          className="prose prose-lg dark:prose-invert max-w-none
                     prose-headings:text-gray-900 dark:prose-headings:text-gray-100
                     prose-p:text-gray-700 dark:prose-p:text-gray-300
                     prose-strong:text-gray-900 dark:prose-strong:text-gray-100
                     prose-ul:text-gray-700 dark:prose-ul:text-gray-300
                     prose-li:text-gray-700 dark:prose-li:text-gray-300
                     prose-code:text-gray-900 dark:prose-code:text-gray-100
                     prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                     prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                     prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                     prose-pre:text-gray-900 dark:prose-pre:text-gray-100"
          dangerouslySetInnerHTML={{ __html: blogPost.content }}
        />
      </article>

      {/* Navigation */}
      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <Link href="/blogs">
            <Button
              classname="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              onclick={() => {}}
            >
              <FaArrowLeft />
              Previous Article
            </Button>
          </Link>
          <Link href="/blogs">
            <Button
              classname="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
              onclick={() => {}}
            >
              Next Article
              <FaArrowLeft className="rotate-180" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
