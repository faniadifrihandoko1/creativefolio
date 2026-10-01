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
      <p>Design systems have become essential for creating consistent, scalable, and maintainable user interfaces — but most teams only scratch the surface. They build a component library, call it a design system, and wonder why inconsistency creeps back within a year. This article goes deeper: we unpack each foundation of a real design system, trace one component end-to-end from design token to documentation, and cover the adoption, versioning, and governance practices that separate systems that survive from those that quietly die.</p>

      <h2>What Is a Design System, Really?</h2>
      <p>A design system is not a UI kit, a Figma file, or a folder of components. It is a <strong>product that serves products</strong>: a complete set of standards, reusable components, and patterns, bound together by documentation and governed like software. Brad Frost's atomic design gave us a useful vocabulary — atoms, molecules, organisms — but the modern definition goes further. A design system includes the <em>rules for change</em>: how tokens are named, how components evolve, who can contribute, and how breaking changes are communicated.</p>
      <p>Think of it in three layers. The <strong>visual language</strong> defines what the product looks like (color, type, spacing, motion). The <strong>component layer</strong> defines what the product is built from (buttons, inputs, dialogs). The <strong>guidance layer</strong> defines how it all gets used (patterns, voice, accessibility rules, contribution workflows). Miss any layer and you have a library, not a system.</p>

      <h2>The Four Foundations</h2>
      <p>Every durable design system rests on four foundations. Each one deserves deliberate design, because weakness in any of them leaks into everything built on top.</p>

      <h3>1. Design Tokens: The Single Source of Truth</h3>
      <p>Design tokens are platform-agnostic variables that store visual design decisions — color, typography, spacing, radius, shadow, motion. Instead of hard-coding a hex value in fifty files, you reference a token. When the brand color changes, you change it once. Tokens are typically organized in three tiers:</p>
      <ul>
        <li><strong>Base (primitive) tokens:</strong> raw values with generic names, e.g. <code>blue-500</code> or <code>space-4</code>. They describe <em>what</em> the value is.</li>
        <li><strong>Semantic tokens:</strong> purpose-driven aliases, e.g. <code>color.action.primary</code> pointing at <code>blue-500</code>. They describe <em>how</em> the value is used.</li>
        <li><strong>Component tokens:</strong> narrow aliases for specific parts, e.g. <code>button.primary.background</code> pointing at <code>color.action.primary</code>. They describe <em>where</em> the value is used.</li>
      </ul>
      <p>This aliasing chain is what makes theming and dark mode tractable: you remap the semantic layer once instead of hunting through components. The W3C Design Tokens Community Group (DTCG) format has emerged as the interchange standard, supported by tools like Style Dictionary and Tokens Studio:</p>
      <pre><code>{
  "color": {
    "blue": {
      "500": {
        "$value": "#2563eb",
        "$type": "color"
      }
    },
    "action": {
      "primary": {
        "$value": "{color.blue.500}",
        "$type": "color",
        "$description": "Default background for primary actions"
      }
    }
  },
  "space": {
    "4": { "$value": "16px", "$type": "dimension" }
  },
  "button": {
    "primary": {
      "background": { "$value": "{color.action.primary}", "$type": "color" },
      "padding-x": { "$value": "{space.4}", "$type": "dimension" }
    }
  }
}</code></pre>
      <p>From this single JSON source, build tools generate CSS custom properties for the web, constants for iOS, and resources for Android — one truth, many platforms. A practical rule: name tokens by <strong>intent, not appearance</strong>. <code>color.text.danger</code> survives a rebrand; <code>color.red</code> invites misuse the moment red means something else.</p>

      <h3>2. Components: Encapsulated, API-Driven Building Blocks</h3>
      <p>Components are where tokens become interface. A good component is <strong>encapsulated</strong> (its styles don't leak, and outside styles don't break it), <strong>composable</strong> (small pieces combine into larger ones), and <strong>API-driven</strong> (behavior is controlled through a clear, documented props interface rather than CSS overrides).</p>
      <p>Design component APIs the way you design public APIs, because that's what they are. Prefer a small set of <code>variant</code> and <code>size</code> props over boolean soup like <code>isPrimaryLargeRounded</code>. Every component should define its full <strong>state matrix</strong>: default, hover, focus, active, disabled, loading, and error — each one designed, not left to browser defaults. Accessibility is part of the component, not a layer added later: keyboard operability, visible focus indicators, sufficient contrast, and correct ARIA roles ship inside the component so product teams get them for free.</p>
      <p>A useful test: can a developer use the component correctly without reading its source code? If yes, the API is well designed. If the answer is "just wrap it in a div and add some custom CSS," the component has failed its contract.</p>

      <h3>3. Patterns: Guidance for Composition</h3>
      <p>Components answer "what can I use?" Patterns answer "how should I assemble it?" Patterns live one level above components: form layouts with inline validation, empty states, error handling, navigation structures, data tables with pagination, onboarding flows. They capture <strong>decisions that repeat</strong> across features.</p>
      <p>Good patterns include the rationale, not just the recipe: <em>why</em> the form places errors inline rather than in a summary banner, <em>when</em> to use a modal versus a dedicated page, and explicit <strong>do / don't</strong> examples with visuals. Patterns are also where product-specific conventions live — the things a generic component library can never know, like how your checkout flow handles declined payments. Without patterns, teams assemble the same components into wildly different experiences, and the consistency you bought the system for evaporates at the page level.</p>

      <h3>4. Documentation: The System's User Interface</h3>
      <p>Documentation is how the design system meets its users — the designers and developers building products. An undocumented component might as well not exist; teams will rebuild their own rather than guess at an API. Effective documentation is <strong>living</strong>: generated or co-located with the code so it can't drift out of date, versioned alongside releases, and written for two audiences at once.</p>
      <p>Designers need anatomy diagrams, spacing rules, content guidelines, and do/don't examples. Developers need props tables, code snippets, framework-specific notes, and migration guides. Both need accessibility requirements stated plainly. Treat documentation like product copy: clear, scannable, example-first. If contributing to the system requires tribal knowledge, the documentation has failed.</p>

      <h2>Anatomy of a Component: From Token to Documentation</h2>
      <p>Theory is cheap — let's trace one component through the entire pipeline. We'll follow a humble <strong>Button</strong>, the most-used and most-abused component in any system, from raw token to published documentation.</p>

      <h3>Step 1: Tokens Feed the Component</h3>
      <p>Our button never hard-codes a value. Its primary variant draws from the component-token tier we defined earlier: <code>button.primary.background</code> resolves through <code>color.action.primary</code> down to a single hex value. Spacing, radius, and type come from <code>space</code>, <code>radius</code>, and <code>text</code> tokens. If the brand refreshes next year, the button updates without a single line of component code changing — that's the payoff of the aliasing chain.</p>

      <h3>Step 2: Implementation</h3>
      <p>The component consumes the tokens as CSS custom properties (generated from the token JSON) and exposes a tight API. States are designed explicitly — note the visible focus ring and the disabled treatment, both accessibility requirements, not afterthoughts:</p>
      <pre><code>.btn {
  background: var(--button-primary-background);
  color: var(--color-text-on-action);
  padding: var(--space-2) var(--button-primary-padding-x);
  border-radius: var(--radius-md);
  font: var(--text-button);
  border: none;
  cursor: pointer;
  transition: background 150ms ease;
}
.btn:hover { background: var(--button-primary-background-hover); }
.btn:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }</code></pre>

      <h3>Step 3: Usage in Products</h3>
      <p>Product teams never touch the CSS. They compose through the component API, and the variant system keeps visual decisions inside the design system where they can be governed:</p>
      <pre><code>&lt;Button variant="primary" size="md" onClick={handleSave}&gt;
  Save changes
&lt;/Button&gt;

&lt;Button variant="secondary" size="sm" disabled&gt;
  Cancel
&lt;/Button&gt;</code></pre>
      <p>Notice what's absent: no className overrides, no inline styles, no one-off hex codes. When every team consumes the same API, a design change propagates as a version bump, not a hundred pull requests.</p>

      <h3>Step 4: Documentation</h3>
      <p>Finally, the button earns a documentation page that serves both audiences: an anatomy diagram labeling the container, label, icon slot, and padding; a props table (<code>variant</code>, <code>size</code>, <code>disabled</code>, <code>loading</code>); live examples of every variant and state; content guidelines ("use sentence case; keep labels under three words"); and an accessibility checklist — minimum 44px touch target, 4.5:1 contrast, keyboard operability, announced loading state. This page is the component's contract with its users. When the contract is clear, adoption follows.</p>

      <h2>Adopting a Design System in Your Team</h2>
      <p>The best-built system fails if nobody adopts it. Adoption is a <strong>change-management</strong> problem, not a tooling problem, and it needs a strategy from day one.</p>
      <ul>
        <li><strong>Start with a pilot, not a mandate.</strong> Partner with one product team on a real feature. Ship something, measure the time saved, then let that team become your advocate. Mandates breed resentment; success stories breed pull.</li>
        <li><strong>Define a contribution model.</strong> The core team can't build everything. Document how product teams propose new components or variants, who reviews them, and what the bar for inclusion is. A lightweight RFC or proposal template prevents both chaos and bottlenecks.</li>
        <li><strong>Govern without gatekeeping.</strong> A small working group — design, engineering, accessibility — reviews additions for consistency and quality. Their job is curation, not control: say yes with modifications far more often than no.</li>
        <li><strong>Communicate like a product.</strong> Release notes, a changelog, a dedicated channel, office hours. Every breaking change needs a migration guide written <em>before</em> the release, not after the complaints.</li>
        <li><strong>Measure what matters.</strong> Track component adoption rate, the number of one-off overrides, and time-to-build for common screens. When you can show that teams ship forms faster with system components, funding and buy-in take care of themselves.</li>
      </ul>

      <h2>Versioning: Treating the System Like Software</h2>
      <p>A design system is a dependency, so version it like one. <strong>Semantic versioning</strong> gives consumers a contract: patch releases fix bugs, minor releases add components or variants in a backward-compatible way, and major releases may break things — renamed props, removed variants, restructured tokens. Consumers should be able to upgrade a minor version without reading a migration guide.</p>
      <p>Tools like <strong>Changesets</strong> make this workflow concrete. Each pull request that changes the system includes a small markdown file declaring the bump type and a human-readable summary:</p>
      <pre><code># Add a changeset with:
npx changeset
# select patch / minor / major, then describe the change

# On release, versions are bumped and a changelog generated:
npx changeset version</code></pre>
      <p>Pair this with a <strong>deprecation policy</strong>: never remove a component outright. Mark it deprecated, announce the removal version (at least one major version away), provide a codemod or migration guide, and only then delete. Respect for consumers' upgrade budgets is what keeps teams on the latest version instead of forking their own copies.</p>

      <h2>Common Mistakes to Avoid</h2>
      <p>Most design systems don't fail from lack of effort — they fail from predictable mistakes. Watch for these:</p>
      <ul>
        <li><strong>Building a component library and calling it a system.</strong> Without tokens, patterns, documentation, and governance, you have a UI kit that drifts. The unglamorous parts are the system.</li>
        <li><strong>Boiling the ocean.</strong> Trying to design every component before shipping any means the system arrives obsolete. Start with the ten components every screen needs; let real usage pull the rest.</li>
        <li><strong>Over-abstracting too early.</strong> A button with forty props is worse than two focused components. Abstract from repeated real usage, not from imagined future needs.</li>
        <li><strong>Ignoring the contribution path.</strong> If product teams can't feed improvements back, they'll fork. A system nobody can contribute to becomes a system everybody works around.</li>
        <li><strong>Breaking changes without migration paths.</strong> Nothing kills trust faster than an upgrade that silently breaks production. Deprecate loudly, migrate gently.</li>
        <li><strong>Designing for the portfolio, not the product.</strong> Pixel-perfect showcase pages that ignore edge cases — long strings, empty states, right-to-left languages, large zoom levels — produce components that shatter on contact with reality.</li>
        <li><strong>Treating accessibility as a phase.</strong> Bolting on accessibility at the end means rebuilding components. Bake contrast, keyboard support, and semantics into the first version of every component.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>A design system is a long-term investment in how your organization builds interfaces. Tokens give you a single source of truth; components turn that truth into reusable interface; patterns guide composition; documentation makes it all usable. Adoption, versioning, and governance keep it alive. Start small — one pilot team, a handful of tokens, your most-used components — and grow the system from real demand rather than speculation. The systems that survive aren't the most complete on day one; they're the ones teams actually want to use on day one hundred.</p>
    `,
    author: "Fani Adi Frihandoko",
    publishedAt: "2024-01-05",
    tags: ["Design", "UI/UX", "Design Systems"],
    readTime: "15 min read",
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
