"use client";
import Header from "@/app/components/Fragements/Header";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaCalendarAlt, FaTag, FaUser } from "react-icons/fa";

interface BlogDetailProps {
  params: {
    slug: string;
  };
}

const sampleBlogs = [
  {
    id: 1,
    title: "Building Modern Web Applications with Next.js 14",
    slug: "building-modern-web-applications-with-nextjs-14",
    description:
      "Discover the latest features in Next.js 14 and how to leverage them for building scalable web applications with improved performance and developer experience.",
    content: `
      <p>Next.js 14 is more than an incremental upgrade — it is the release where the App Router, React Server Components, and a server-first mental model became the default way to build React applications. If you learned Next.js in the <strong>pages/</strong> era, much of what you know still works, but the idiomatic way to build has changed. This guide rebuilds your mental model from the ground up: what each new primitive does, when to reach for it, and the traps that catch even experienced developers.</p>

      <h2>1. The App Router: routes as a folder tree</h2>
      <p>The App Router replaces the <strong>pages/</strong> directory with <strong>app/</strong>. Every folder under <strong>app/</strong> is a route segment, and each route is defined by special files inside it:</p>
      <ul>
        <li><strong>page.tsx</strong> — the UI of the route (required for the route to be public)</li>
        <li><strong>layout.tsx</strong> — shared UI wrapping all child routes; it persists across navigation and preserves state</li>
        <li><strong>loading.tsx</strong> — instant loading UI, automatically wrapped in a Suspense boundary</li>
        <li><strong>error.tsx</strong> — error UI for the segment, automatically wrapped in an error boundary</li>
        <li><strong>not-found.tsx</strong> — UI rendered when a route calls notFound()</li>
      </ul>

      <pre><code>app/
  layout.tsx          -&gt; root layout (the html and body tags live here)
  page.tsx            -&gt; /
  blog/
    page.tsx          -&gt; /blog
    [slug]/
      page.tsx        -&gt; /blog/hello-world
  (marketing)/
    about/page.tsx    -&gt; /about (route group: no URL segment)
  _lib/
    format.ts         -&gt; private folder: never becomes a route</code></pre>

      <p>Two folder conventions deserve special attention. <strong>Route groups</strong> — folders wrapped in parentheses like <strong>(marketing)</strong> — let you organize code and apply different layouts without affecting the URL. <strong>Private folders</strong> — prefixed with an underscore like <strong>_lib</strong> — are excluded from routing entirely, which is where helpers and components that must never be reachable as URLs should live.</p>
      <p>Unlike the pages router, layouts do <strong>not</strong> re-render when you navigate between sibling pages. That is usually what you want (persistent sidebar, preserved form state), but it also means data fetched in a layout is not refetched on navigation. If a layout shows user-specific data, pair it with on-demand revalidation (see section 5) instead of expecting a fresh fetch per navigation.</p>

      <h2>2. React Server Components: the new default</h2>
      <p>Every component in the App Router is a <strong>Server Component</strong> unless you opt out with the <strong>"use client"</strong> directive. Server Components render on the server and ship <strong>zero JavaScript</strong> to the browser. That unlocks three things that were awkward before:</p>
      <ul>
        <li>Direct access to backend resources — databases, the file system, internal services — with no API layer in between</li>
        <li>Heavy dependencies (a markdown parser, a syntax highlighter) that never bloat the client bundle</li>
        <li>Automatic code splitting: the client only downloads JavaScript for the interactive parts of the page</li>
      </ul>

      <pre><code>// app/blog/[slug]/page.tsx — a Server Component (no directive needed)
import { getPost } from "@/lib/posts";

export default async function BlogPost({ params }) {
  // Direct data access: no fetch(), no useEffect, no loading-state boilerplate
  const post = await getPost(params.slug);
  return (
    &lt;article&gt;
      &lt;h1&gt;{post.title}&lt;/h1&gt;
      &lt;div dangerouslySetInnerHTML={{ __html: post.html }} /&gt;
    &lt;/article&gt;
  );
}</code></pre>

      <p>Notice the component is <strong>async</strong> — Server Components can await data directly in the component body. Client Components (<strong>"use client"</strong>) are still needed for interactivity: event handlers, useState, useEffect, and browser APIs. The golden rule is to <strong>push "use client" as far down the tree as possible</strong>: keep the page itself a Server Component and make only the interactive widget a Client Component, so the static shell around it ships no JavaScript.</p>
      <p><strong>Common pitfall:</strong> props passed from a Server Component to a Client Component must be serializable. You cannot pass functions (except Server Actions), class instances, or Date objects across the boundary — they fail at runtime. Pass plain data down, and create callbacks inside the Client Component.</p>

      <h2>3. Streaming and Suspense: render before the data arrives</h2>
      <p>Traditionally, a slow database query blocks the entire page. <strong>Streaming</strong> lets the server send HTML in chunks: the shell renders instantly and slow sections stream in as they resolve. You opt in with <strong>Suspense boundaries</strong> — or the <strong>loading.tsx</strong> convention, which is just a Suspense boundary around the whole segment.</p>

      <pre><code>// app/dashboard/page.tsx
import { Suspense } from "react";
import { RevenueChart, RecentOrders } from "./widgets";

export default function DashboardPage() {
  return (
    &lt;main&gt;
      &lt;h1&gt;Dashboard&lt;/h1&gt;
      {/* Slow widgets stream in independently — the rest is instant */}
      &lt;Suspense fallback={&lt;ChartSkeleton /&gt;}&gt;
        &lt;RevenueChart /&gt;
      &lt;/Suspense&gt;
      &lt;Suspense fallback={&lt;OrdersSkeleton /&gt;}&gt;
        &lt;RecentOrders /&gt;
      &lt;/Suspense&gt;
    &lt;/main&gt;
  );
}</code></pre>

      <p><strong>Real-world use case:</strong> an analytics dashboard where the revenue chart takes 2 seconds but the KPI cards take 200ms. Without streaming, the user stares at a blank page for 2 seconds. With per-widget Suspense boundaries, the KPIs appear immediately and each slow widget pops in when ready.</p>
      <p><strong>Common pitfall:</strong> wrapping the entire page in one Suspense boundary (or relying only on loading.tsx) recreates the all-or-nothing problem. Place boundaries around the slow units, not around the page.</p>

      <h2>4. Data fetching and caching: fetch() with superpowers</h2>
      <p>In Server Components, the native <strong>fetch()</strong> is extended with caching semantics. Next.js automatically <strong>memoizes</strong> identical fetch calls within a single render pass (request memoization), and caches the result across requests (data cache):</p>

      <pre><code>// Cached for 1 hour (time-based revalidation)
const res = await fetch("https://api.example.com/posts", {
  next: { revalidate: 3600 },
});

// Never cached — always fresh (e.g. personalized data)
const user = await fetch("https://api.example.com/me", {
  cache: "no-store",
});</code></pre>

      <p>For data that changes on user actions rather than on a timer, use <strong>on-demand revalidation</strong>: tag your fetches and invalidate them when a mutation happens.</p>

      <pre><code>// Tag the fetch...
await fetch("https://api.example.com/posts", {
  next: { tags: ["posts"] },
});

// ...then invalidate from anywhere (e.g. after creating a post)
import { revalidateTag } from "next/cache";
revalidateTag("posts");</code></pre>

      <p><strong>Best practice:</strong> fetch data in the component that needs it, not at the top of the tree. Request memoization deduplicates identical calls automatically, so colocating fetches keeps components self-contained without extra network requests.</p>
      <p><strong>Common pitfall:</strong> fetch() inside a Client Component does not participate in any of this — no memoization, no data cache. If a Client Component needs server data, fetch it in the parent Server Component and pass it down as props.</p>

      <h2>5. Server Actions: mutations without an API route</h2>
      <p><strong>Server Actions</strong> are async functions that run on the server but are called directly from the client — typically from forms. They eliminate the boilerplate API route for simple mutations, and they work with <strong>progressive enhancement</strong>: the form still submits if JavaScript is disabled.</p>

      <pre><code>// app/comments/actions.ts
"use server";
import { revalidatePath } from "next/cache";

export async function addComment(formData: FormData) {
  const text = formData.get("text");
  await db.comment.create({ data: { text: String(text) } });
  revalidatePath("/blog/my-post"); // refresh the cached page
}

// app/comments/form.tsx
import { addComment } from "./actions";

export function CommentForm() {
  return (
    &lt;form action={addComment}&gt;
      &lt;input name="text" placeholder="Write a comment..." /&gt;
      &lt;button type="submit"&gt;Post&lt;/button&gt;
    &lt;/form&gt;
  );
}</code></pre>

      <p><strong>Real-world use case:</strong> newsletter signup, contact forms, like buttons, and admin CRUD screens — any mutation that does not need a public REST API. Pair the action with <strong>useFormStatus</strong> (from react-dom) to show a pending state on the submit button.</p>
      <p><strong>Common pitfall:</strong> Server Actions must be async functions defined in a file with the <strong>"use server"</strong> directive (or inline in a Server Component). They cannot be defined inside a Client Component — importing them into one is fine, defining them there is not.</p>

      <h2>6. Metadata and SEO: configuration, not components</h2>
      <p>SEO moved from the <strong>&lt;Head&gt;</strong> component to a static <strong>metadata</strong> export (or the async <strong>generateMetadata</strong> function for dynamic values). Next.js renders it into proper head tags, handles deduplication across nested layouts, and even generates Open Graph images at request time.</p>

      <pre><code>// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: ["/og/" + params.slug + ".png"] },
  };
}</code></pre>

      <p><strong>Best practice:</strong> define shared metadata (site name, default description, theme color) once in the root layout, and let each page override only what is specific. Metadata defined deeper in the tree merges with — rather than replaces — the parent's.</p>

      <h2>7. Route Handlers: API endpoints in the app directory</h2>
      <p>When you genuinely need an HTTP endpoint — webhooks, third-party callbacks, or proxying a request — <strong>Route Handlers</strong> (a <strong>route.ts</strong> file) replace the old API routes. They support the full Request/Response API and run on the Node.js runtime by default.</p>

      <pre><code>// app/api/newsletter/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email } = await request.json();
  await subscribe(email);
  return NextResponse.json({ ok: true }, { status: 201 });
}</code></pre>

      <p><strong>Common pitfall:</strong> Route Handlers are cached by default for GET requests. For endpoints that must always run (a webhook receiver, a search proxy), export <strong>const dynamic = "force-dynamic"</strong> at the top of the file to opt out of static rendering.</p>

      <h2>8. Middleware: code that runs before the route</h2>
      <p><strong>Middleware</strong> (<strong>middleware.ts</strong> at the project root) runs before a request completes — ideal for authentication checks, internationalization redirects, and A/B testing. It runs on the Edge Runtime, so it starts fast worldwide, but it cannot use Node.js APIs.</p>

      <pre><code>// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("session");
  if (!token &amp;&amp; request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // only run where needed
};</code></pre>

      <p><strong>Common pitfall:</strong> middleware without a <strong>matcher</strong> runs on every request — including static assets — adding latency everywhere. Always scope it with a matcher, and keep it lean: no database calls, no heavy computation.</p>

      <h2>9. Putting it together: a real-world product page</h2>
      <p>Consider an e-commerce product page. The shell — title, images, description — is a Server Component that fetches product data with a 60-second revalidation. Below it, reviews stream in inside a Suspense boundary because the review service is slow. The "add to cart" button is a tiny Client Component; the review form posts through a Server Action that calls <strong>revalidateTag("reviews")</strong>. Metadata comes from generateMetadata for rich social previews, and a Route Handler receives the payment webhook. Six primitives, one coherent page — and only the cart button and review form ship JavaScript.</p>

      <h2>10. Best practices and traps, summarized</h2>
      <ul>
        <li><strong>Default to Server Components.</strong> Add "use client" only where interactivity demands it, and push the boundary down to the smallest component possible.</li>
        <li><strong>Colocate data fetching</strong> with the component that renders the data; memoization makes it free.</li>
        <li><strong>Choose the right revalidation:</strong> revalidate timers for slowly changing content, revalidateTag/revalidatePath for content that changes on user actions.</li>
        <li><strong>Keep Server Components serializable-safe:</strong> only plain data crosses into Client Components.</li>
        <li><strong>Scope middleware with a matcher</strong> and remember it runs on the Edge — no Node APIs.</li>
        <li><strong>Do not fetch secrets client-side.</strong> API keys and database credentials belong in Server Components, Server Actions, and Route Handlers — never in "use client" code.</li>
        <li><strong>Trap:</strong> async/await in a Client Component body is not supported — data fetching with await belongs in Server Components; Client Components still use useEffect or libraries like SWR.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Next.js 14 rewards a simple mental shift: <strong>the server is the default, the client is the exception</strong>. Let Server Components fetch and render, stream the slow parts with Suspense, mutate with Server Actions, and reserve client JavaScript for genuine interactivity. Master these eight primitives — App Router, Server Components, Streaming, caching, Server Actions, Metadata, Route Handlers, and Middleware — and you have the complete toolkit for building fast, scalable web applications with Next.js 14.</p>
    `,
    author: "John Doe",
    publishedAt: "2024-01-15",
    tags: ["Next.js", "React", "Web Development", "Tutorial"],
    readTime: "15 min read",
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
  {
    id: 5,
    title: "Typography Fundamentals: Pairing Type for the Web",
    slug: "typography-fundamentals-pairing-type-for-the-web",
    description:
      "Learn how to choose, pair, and scale typefaces — from font anatomy to modular scales — to make your web typography readable, expressive, and consistent.",
    content: `
      <p>Typography is the voice of your interface. Before users read a single word, the typeface, spacing, and scale already tell them how to feel — formal or playful, trustworthy or edgy. Getting the fundamentals right turns plain text into a design element.</p>

      <h2>1. Know Your Font Anatomy</h2>
      <p>Every typeface has a personality built from its anatomy: x-height, ascenders, descenders, and contrast between thick and thin strokes. High x-height fonts stay legible at small sizes — ideal for body text on screens.</p>

      <h2>2. Pairing Typefaces</h2>
      <p>A reliable pairing formula is one serif + one sans-serif, or one display face + one workhorse text face. Keep contrast in the roles (headings vs. body) but harmony in the mood. Two fonts are usually enough; three is the maximum for most interfaces.</p>

      <h3>Practical tips</h3>
      <ul>
        <li><strong>Contrast, not clash:</strong> Pair fonts that differ in at least one axis — weight, width, or style</li>
        <li><strong>One superfamily:</strong> When in doubt, use different weights of the same family</li>
        <li><strong>Test real content:</strong> Preview with your actual copy, not lorem ipsum</li>
      </ul>

      <h2>3. Scale With a Modular Scale</h2>
      <p>Build your type scale from a base size and a ratio (1.25, 1.333, or 1.5). A modular scale creates rhythm: headings, subheadings, and body text relate to each other mathematically instead of by guesswork.</p>

      <h2>4. Line Length and Spacing</h2>
      <p>Aim for 45–75 characters per line for body text, with line-height around 1.5–1.7. Generous spacing between paragraphs and sections gives the eye clear landmarks while scanning.</p>

      <h2>Conclusion</h2>
      <p>Good typography is invisible — readers notice the message, not the letters. Master anatomy, pairing, scale, and spacing, and your interfaces will communicate with clarity and character.</p>
    `,
    author: "Fani Adi Frihandoko",
    publishedAt: "2024-01-25",
    tags: ["Typography", "Web Design", "Design Fundamentals"],
    readTime: "8 min read",
  },
  {
    id: 6,
    title: "UI Design Principles: Crafting Intuitive Interfaces",
    slug: "ui-design-principles-crafting-intuitive-interfaces",
    description:
      "Explore core UI design principles — visual hierarchy, consistency, and feedback — to craft interfaces that feel intuitive and delightful for users.",
    content: `
      <p>Great interfaces feel effortless. Behind that simplicity lies a set of timeless UI design principles that guide every layout, color, and interaction decision.</p>
      
      <h2>1. Visual Hierarchy</h2>
      <p>Guide the user's eye with size, weight, color, and spacing. The most important element on the screen should be the first thing noticed — everything else supports it.</p>
      
      <h2>2. Consistency</h2>
      <p>Reuse the same patterns, components, and language across screens. Consistency reduces the learning curve: once users learn one part of your interface, they understand the rest.</p>
      
      <h3>Practical tips</h3>
      <ul>
        <li><strong>Design tokens:</strong> Define colors, spacing, and typography once</li>
        <li><strong>Component library:</strong> Build once, reuse everywhere</li>
        <li><strong>Predictable behavior:</strong> Similar actions should work the same way</li>
      </ul>
      
      <h2>3. Feedback & Affordance</h2>
      <p>Every interaction deserves a response. Buttons depress, toggles slide, forms validate inline. Clear affordances tell users what is possible before they even try.</p>
      
      <h2>4. Whitespace Is a Feature</h2>
      <p>Empty space is not wasted space — it groups related elements, reduces cognitive load, and gives the design room to breathe.</p>
      
      <h2>Conclusion</h2>
      <p>Intuitive interfaces are designed, not accidental. Apply hierarchy, consistency, feedback, and whitespace deliberately, and your UI will feel natural to everyone who uses it.</p>
    `,
    author: "Fani Adi Frihandoko",
    publishedAt: "2024-01-20",
    tags: ["UI Design", "UX", "Design Principles"],
    readTime: "7 min read",
  },
];

export const BlogDetailView = ({ params }: BlogDetailProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Find the blog post based on the slug
  const blogPost = sampleBlogs.find((blog) => blog.slug === params.slug);

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

      <div className="mt-16 mb-16 pt-8 border-t border-gray-200 dark:border-gray-700">
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
