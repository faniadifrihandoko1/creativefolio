import Header from "@/app/components/Fragements/Header";
import Button from "@/app/components/Elements/Button";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaTag } from "react-icons/fa";
import Link from "next/link";

interface BlogDetailProps {
  params: {
    slug: string;
  };
}

// Sample blog data - in a real app, this would come from a CMS or database
const sampleBlogs = [
  {
    id: 1,
    title: "Building Modern Web Applications with Next.js 14",
    slug: "building-modern-web-applications-with-nextjs-14",
    description:
      "Discover the latest features in Next.js 14 and how to leverage them for building scalable web applications with improved performance and developer experience.",
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
  },
  {
    id: 2,
    title: "The Art of Clean Code: Best Practices for Developers",
    slug: "the-art-of-clean-code-best-practices-for-developers",
    description:
      "Learn essential principles and practices for writing maintainable, readable, and efficient code that stands the test of time.",
    content: `
      <p>Clean code is not just about making your code work—it's about making it readable, maintainable, and efficient. In this article, we'll explore the fundamental principles that every developer should know.</p>
      
      <h2>What is Clean Code?</h2>
      <p>Clean code is code that is easy to read, understand, and modify. It follows consistent patterns, uses meaningful names, and is structured in a way that makes its purpose clear.</p>
      
      <h3>Key Principles</h3>
      <ul>
        <li><strong>Meaningful Names:</strong> Use descriptive names for variables, functions, and classes</li>
        <li><strong>Single Responsibility:</strong> Each function should do one thing well</li>
        <li><strong>DRY Principle:</strong> Don't Repeat Yourself - avoid code duplication</li>
        <li><strong>Consistent Formatting:</strong> Use consistent indentation and spacing</li>
      </ul>
      
      <h2>Best Practices</h2>
      <p>Here are some practical tips for writing cleaner code:</p>
      
      <h3>1. Use Descriptive Names</h3>
      <pre><code>// Bad
const d = new Date();
const u = getUsers();

// Good
const currentDate = new Date();
const activeUsers = getActiveUsers();</code></pre>
      
      <h3>2. Keep Functions Small</h3>
      <p>Functions should be small and focused on a single task. If a function is doing too many things, consider breaking it down into smaller functions.</p>
      
      <h2>Conclusion</h2>
      <p>Writing clean code is an investment in the future. It makes your codebase more maintainable, reduces bugs, and improves team productivity.</p>
    `,
    author: "Fani Adi Frihandoko",
    publishedAt: "2024-01-10",
    tags: ["Programming", "Best Practices", "Code Quality"],
    readTime: "6 min read",
  },
  {
    id: 3,
    title: "Design Systems: Creating Consistent User Experiences",
    slug: "design-systems-creating-consistent-user-experiences",
    description:
      "Explore how design systems can help create cohesive, scalable, and maintainable user interfaces across your entire product ecosystem.",
    content: `
      <p>Design systems have become essential for creating consistent, scalable, and maintainable user interfaces. They provide a shared language and set of components that ensure consistency across your entire product.</p>
      
      <h2>What is a Design System?</h2>
      <p>A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications.</p>
      
      <h3>Core Components</h3>
      <ul>
        <li><strong>Design Tokens:</strong> Colors, typography, spacing, and other visual properties</li>
        <li><strong>Component Library:</strong> Reusable UI components</li>
        <li><strong>Patterns:</strong> Common interaction patterns and layouts</li>
        <li><strong>Documentation:</strong> Guidelines and usage examples</li>
      </ul>
      
      <h2>Benefits of Design Systems</h2>
      <p>Implementing a design system brings numerous benefits to your team and product:</p>
      
      <ul>
        <li>Consistency across all touchpoints</li>
        <li>Faster development and prototyping</li>
        <li>Reduced design and development debt</li>
        <li>Better collaboration between teams</li>
        <li>Improved accessibility and usability</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>Building a design system is an iterative process. Start with your most common components and gradually expand your system based on real usage patterns.</p>
      
      <h2>Conclusion</h2>
      <p>A well-designed design system is an investment that pays dividends in consistency, efficiency, and user experience quality.</p>
    `,
    author: "Fani Adi Frihandoko",
    publishedAt: "2024-01-05",
    tags: ["Design", "UI/UX", "Design Systems"],
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "Performance Optimization Techniques for React Applications",
    slug: "performance-optimization-techniques-for-react-applications",
    description:
      "Dive deep into advanced React optimization techniques including memoization, code splitting, and bundle analysis to create lightning-fast applications.",
    content: `
      <p>Performance is crucial for user experience. In this comprehensive guide, we'll explore advanced techniques to optimize your React applications for speed and efficiency.</p>
      
      <h2>Why Performance Matters</h2>
      <p>Fast applications lead to better user engagement, higher conversion rates, and improved SEO rankings. Every millisecond counts in today's competitive digital landscape.</p>
      
      <h3>Key Optimization Areas</h3>
      <ul>
        <li><strong>Bundle Size:</strong> Minimize JavaScript bundle size</li>
        <li><strong>Rendering:</strong> Optimize component rendering</li>
        <li><strong>Network:</strong> Reduce network requests and data transfer</li>
        <li><strong>Memory:</strong> Prevent memory leaks and optimize memory usage</li>
      </ul>
      
      <h2>React Optimization Techniques</h2>
      
      <h3>1. Memoization</h3>
      <p>Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders:</p>
      
      <pre><code>const ExpensiveComponent = React.memo(({ data }) => {
  const processedData = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);
  
  return <div>{processedData}</div>;
});</code></pre>
      
      <h3>2. Code Splitting</h3>
      <p>Split your code into smaller chunks that can be loaded on demand:</p>
      
      <pre><code>const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}</code></pre>
      
      <h3>3. Virtual Scrolling</h3>
      <p>For large lists, implement virtual scrolling to render only visible items:</p>
      
      <h2>Bundle Analysis</h2>
      <p>Regularly analyze your bundle to identify optimization opportunities:</p>
      
      <pre><code>npm install --save-dev webpack-bundle-analyzer</code></pre>
      
      <h2>Conclusion</h2>
      <p>Performance optimization is an ongoing process. Monitor your application's performance regularly and implement these techniques to create lightning-fast user experiences.</p>
    `,
    author: "Sarah Wilson",
    publishedAt: "2024-01-01",
    tags: ["React", "Performance", "Optimization"],
    readTime: "12 min read",
  },
];

const BlogDetail = ({ params }: BlogDetailProps) => {
  // Find the blog post based on the slug
  const blogPost = sampleBlogs.find((blog) => blog.slug === params.slug);

  // If blog post not found, show 404
  if (!blogPost) {
    return (
      <div className="w-full min-h-screen pt-28 px-6 md:px-0">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Blog Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/blogs"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-28 px-6 md:px-0">
      <div className="mb-6">
        <Link
          href="/blogs"
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <FaArrowLeft />
          Back to Blogs
        </Link>
      </div>

      <Header title={blogPost.title} description={blogPost.description} />

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

      <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          {(() => {
            const currentIndex = sampleBlogs.findIndex(
              (blog) => blog.slug === params.slug
            );
            const previousBlog =
              currentIndex > 0 ? sampleBlogs[currentIndex - 1] : null;
            const nextBlog =
              currentIndex < sampleBlogs.length - 1
                ? sampleBlogs[currentIndex + 1]
                : null;

            return (
              <>
                {previousBlog ? (
                  <Link
                    href={`/blogs/${previousBlog.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <FaArrowLeft />
                    Previous Article
                  </Link>
                ) : (
                  <div></div>
                )}
                {nextBlog ? (
                  <Link
                    href={`/blogs/${nextBlog.slug}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Next Article
                    <FaArrowLeft className="rotate-180" />
                  </Link>
                ) : (
                  <div></div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
