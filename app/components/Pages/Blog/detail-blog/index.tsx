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
      <p>Typography is the voice of your interface. Before users read a single word, the typeface, spacing, and scale already tell them how to feel — formal or playful, trustworthy or edgy. The oft-quoted line that "95% of web design is typography" is an exaggeration with a true core: on most screens, text <em>is</em> the interface. Buttons are labels, navigation is words, error states are sentences. Get the type wrong and no amount of color or illustration will save the experience.</p>
      <p>This article goes deep on the fundamentals that actually determine whether web type works: how to pair typefaces with a repeatable method (not vibes), how to build scales and hierarchies that hold up across screen sizes, how to protect readability, and how to implement it all on the web without wrecking performance. Along the way we'll look at concrete pairings — what works, what fails, and <em>why</em>.</p>

      <h2>1. Why Screens Are Not Print</h2>
      <p>Typography advice borrowed uncritically from print will mislead you, because screens render type differently. Print has effectively infinite resolution; screens rasterize letterforms onto a coarse pixel grid. That makes three anatomical traits disproportionately important on the web:</p>
      <ul>
        <li><strong>x-height:</strong> the height of lowercase letters. Fonts with a generous x-height (Inter, Source Sans) stay legible at small sizes because their main shapes are physically larger at the same point size.</li>
        <li><strong>Open apertures:</strong> the openings in letters like <em>c</em>, <em>e</em>, <em>s</em>. Open apertures keep letters distinguishable when pixels are scarce — compare a tightly closed grotesque with something like IBM Plex Sans at 13px.</li>
        <li><strong>Stroke contrast:</strong> the difference between thick and thin strokes. High-contrast Didone faces (think fashion magazines) look stunning large but disintegrate at body sizes on screen, where thin strokes vanish into single pixels.</li>
      </ul>
      <p>The practical takeaway: <strong>evaluate body typefaces at body sizes, on a real screen, with real content.</strong> A font that looks gorgeous in a 72pt hero specimen can be unreadable at 15px. Test at the sizes you'll actually ship.</p>

      <h2>2. Type Pairing: a Method, Not a Mood</h2>
      <p>Pairing means assigning <strong>roles</strong>: typically a display face (headings, hero, brand moments) and a text face (body, UI, everything long-form). The job of a pairing is to create enough contrast between the roles that the hierarchy reads instantly, while keeping enough harmony that the page feels like one product, not two websites stapled together.</p>
      <p>The reliable method has three rules:</p>

      <h3>Rule 1: Contrast on at least one axis, harmony on the rest</h3>
      <p>Fonts differ along axes: classification (serif vs. sans), weight, width, contrast, mood. A good pairing contrasts on <strong>one</strong> axis and agrees on the others. A high-contrast transitional serif for display plus a neutral grotesque for body works because the classification contrast is strong while both share a calm, rational mood. Pair two fonts that differ on <em>every</em> axis and you get visual noise; pair two that differ on <em>none</em> and you get the worst outcome of all — see below.</p>

      <h3>Rule 2: Never pair lookalikes</h3>
      <p>The most common pairing failure isn't clashing — it's <strong>insufficient contrast</strong>. Two geometric sans-serifs (say, Poppins for headings and Montserrat for body) look almost the same but not quite. The reader's eye senses <em>something</em> is different but can't tell what, which reads as sloppiness rather than design. If the pairing doesn't look intentional at a glance, it isn't working. When in doubt, increase the contrast or collapse to a single family.</p>

      <h3>Rule 3: Two is the default, three is the ceiling</h3>
      <p>Two typefaces cover nearly every interface: display + text. A third is justified only for a distinct third role — often a monospace for code/data, or a brand script for rare accents. Every additional family adds HTTP requests, cognitive load, and maintenance cost. Most of the best-designed sites you admire use two.</p>
      <p>And the escape hatch that never fails: <strong>the superfamily strategy.</strong> Using different weights and widths of a single family (e.g., Inter 400 for body, Inter 700 for headings, maybe Inter Tight for display) guarantees harmony because the letterforms share DNA, while weight contrast provides the hierarchy. If you're unsure, start here.</p>

      <h2>3. Good vs. Bad Pairings, Explained</h2>
      <p>Let's make this concrete with three evaluations — the reasoning matters more than the specific fonts:</p>

      <h3>Good: Playfair Display (headings) + Inter (body)</h3>
      <p>Why it works: strong classification contrast (high-contrast serif vs. neutral grotesque) gives instant hierarchy — you know what's a heading without thinking. Both have generous x-heights and open apertures, so they share a legible, contemporary feel despite the contrast. The mood agrees (confident, editorial) while the roles differ sharply. This is Rule 1 executed perfectly.</p>

      <h3>Good: Space Grotesk (display) + Space Grotesk 400 (body)</h3>
      <p>Why it works: the superfamily strategy. Same skeleton, so harmony is automatic; weight and size create the contrast. It's nearly impossible to make this look wrong, it loads one font file family, and it still has character thanks to Space Grotesk's quirky letterforms. The lesson: <strong>constraint is a design tool.</strong></p>

      <h3>Bad: Poppins (headings) + Montserrat (body)</h3>
      <p>Why it fails: both are geometric sans-serifs with near-identical construction — circular <em>o</em>s, single-story <em>a</em>s, similar x-heights. There's no role contrast, so headings don't feel like headings; there's just a vague sense that something is "off." This is the lookalike trap from Rule 2. Fix it by either committing to one of them in multiple weights, or replacing one side with a genuinely different classification.</p>

      <h3>Bad: A decorative script for body text</h3>
      <p>Why it fails: scripts and highly stylized display faces are designed to be <em>looked at</em>, not <em>read</em>. At paragraph lengths, unusual letterforms force the reader to decode every word instead of recognizing word shapes — reading speed collapses. Display faces earn their place at large sizes and short lengths; body text belongs to workhorses. <strong>Novelty is a budget: spend it on headings, save it everywhere else.</strong></p>

      <h2>4. Scale: Build a Modular System, Not a Pile of Sizes</h2>
      <p>Random font sizes — 13px here, 17px there, 23px because it "looked right" — produce interfaces with no rhythm. A <strong>modular scale</strong> derives every size from a base size multiplied by a ratio, so sizes relate to each other mathematically and the hierarchy feels inevitable rather than arbitrary.</p>
      <p>Common ratios and their personalities:</p>
      <ul>
        <li><strong>1.125 (Major Second):</strong> subtle, quiet — good for dense UIs and data-heavy products where type shouldn't shout.</li>
        <li><strong>1.25 (Major Third):</strong> the versatile default. Clear hierarchy without drama; works for most marketing and product interfaces.</li>
        <li><strong>1.333 (Perfect Fourth):</strong> confident and editorial. Headings clearly dominate; suits blogs and brand-forward sites.</li>
        <li><strong>1.5 (Perfect Fifth):</strong> dramatic. Use when display type is a brand statement, not for admin dashboards.</li>
      </ul>
      <p>A practical scale from a 16px base at 1.25: <code>12.8 → 16 → 20 → 25 → 31.25 → 39</code>. Round to sensible values (13, 16, 20, 25, 31, 39) and assign each step a <strong>role</strong> — caption, body, lead, h4, h3, h2, h1 — not a component. When every heading level maps to a scale step, the whole product stays consistent even as it grows. And define the scale in relative units (<code>rem</code>) so it respects user font-size preferences and zooms correctly.</p>

      <h2>5. Hierarchy: Five Levers, Used Deliberately</h2>
      <p>Hierarchy answers the reader's first question on any screen: <em>where do I look first?</em> You have five levers, roughly in order of strength:</p>
      <ul>
        <li><strong>Size:</strong> the strongest signal. Bigger reads as more important — but only relatively. A 32px heading next to 16px body works; a 32px heading next to 28px subheading creates ambiguity.</li>
        <li><strong>Weight:</strong> bold vs. regular separates heading from body at the same size. Reserve the heaviest weights for the few elements that deserve maximum emphasis; if everything is bold, nothing is.</li>
        <li><strong>Color:</strong> darker (or brand-colored) text advances; muted gray recedes. Use color for hierarchy sparingly — it doubles as an interactive signal, and overuse confuses both.</li>
        <li><strong>Spacing:</strong> whitespace is hierarchy. A heading with generous space above it reads as the start of a new section; cramped headings blur into the content. Space <em>between</em> groups should exceed space <em>within</em> groups.</li>
        <li><strong>Position:</strong> top-left (in LTR layouts) gets first attention. Put the primary message where the eye lands first instead of fighting reading order.</li>
      </ul>
      <p>The discipline: <strong>each level of your outline should differ from its neighbors by at least two levers.</strong> If h2 and h3 differ only in size by 2px, the hierarchy is mush. Make h3 smaller <em>and</em> lighter, or smaller <em>and</em> muted — then the structure survives even a quick scan.</p>

      <h2>6. Readability: the Non-Negotiables</h2>
      <p>Beautiful type that tires the eye is failed type. These are the measurable foundations:</p>
      <ul>
        <li><strong>Measure (line length):</strong> 45–75 characters per line for body text. Shorter and the eye jumps awkwardly; longer and it gets lost finding the next line. On wide screens, constrain text columns with <code>max-width: 65ch</code> — the <code>ch</code> unit ties the measure to the font itself.</li>
        <li><strong>Line height:</strong> 1.5–1.7 for body text. Tight line-height (below ~1.4) makes paragraphs feel dense and intimidating; it can drop to ~1.1–1.2 for large display headings where lines are few and drama helps.</li>
        <li><strong>Contrast:</strong> body text should meet WCAG AA — 4.5:1 against its background. The trendy light-gray-on-white body copy fails real users in real lighting. Check with a contrast tool, not your calibrated monitor in a dark room.</li>
        <li><strong>Letter spacing:</strong> leave body text alone (or nearly). Add slight tracking (+0.05em or so) only to small-caps labels and uppercase eyebrows, where tight default spacing would blur the letters together. Never letterspace lowercase body copy.</li>
        <li><strong>Paragraph rhythm:</strong> space between paragraphs (or a clear first-line indent — pick one, not both), and visibly larger gaps between sections. Readers navigate by these landmarks when scanning.</li>
      </ul>
      <p>Readability also degrades with viewport: on small screens, slightly increase base size and line-height (thin phone screens punish small type), and let headings wrap rather than shrinking them into illegibility.</p>

      <h2>7. Implementing It on the Web</h2>
      <p>Theory ships as CSS. Three modern techniques cover most of what you need:</p>

      <h3>Fluid type with clamp()</h3>
      <p>Instead of hard breakpoints, let display sizes interpolate smoothly between a minimum and maximum as the viewport grows:</p>
      <pre><code>/* Fluid h1: 2rem at 320px viewport → 3.5rem at 1200px */
h1 {
  font-size: clamp(2rem, 1.2rem + 4vw, 3.5rem);
  line-height: 1.1;
}

/* Fluid body: subtle, keeps measure sane everywhere */
body {
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  line-height: 1.6;
}</code></pre>
      <p>Keep body type nearly fixed (readers need stability) and let display type be fluid (headings have room to breathe). One warning: test the extremes — <code>clamp()</code> with a bad preferred value can produce absurd sizes on ultrawide or tiny screens.</p>

      <h3>Variable fonts: one file, many voices</h3>
      <p>Variable fonts pack weight, width, slant — even optical size — into a single file with adjustable axes. Instead of loading four static weights (400, 500, 700, 900), you load one file and dial any value:</p>
      <pre><code>@font-face {
  font-family: "Inter";
  src: url("/fonts/inter-var.woff2") format("woff2-variations");
  font-weight: 100 900;
  font-display: swap;
}

h1 { font-weight: 780; }   /* any value, not just presets */
.caption { font-weight: 450; }</code></pre>
      <p>The performance win is real: one ~100KB variable file often replaces 300KB+ of static weights. The design win is subtler but bigger — fine-grained weights let you tune hierarchy precisely instead of jumping between whatever presets you happened to load.</p>

      <h3>Loading without the jank</h3>
      <p>Custom fonts block rendering or cause flashes — both are typography failures. The checklist:</p>
      <ul>
        <li><strong><code>font-display: swap</code></strong> — show fallback text immediately, swap when the font arrives. Invisible text (FOIT) is worse than a brief style change (FOUT).</li>
        <li><strong>Preload the critical weights</strong> — <code>&lt;link rel="preload" as="font"&gt;</code> for the body and heading faces so they don't wait behind other resources.</li>
        <li><strong>Subset ruthlessly</strong> — if your audience is Latin-only, don't ship Cyrillic, Greek, and Vietnamese glyphs. Subsetting can halve file sizes.</li>
        <li><strong>Match fallback metrics</strong> — use <code>size-adjust</code> in your <code>@font-face</code> fallback so the swap doesn't reflow the whole page (the dreaded layout shift).</li>
      </ul>

      <h2>8. Common Mistakes</h2>
      <ul>
        <li><strong>Too many typefaces:</strong> four families on one page signals indecision, not richness. Audit and consolidate — most products need two.</li>
        <li><strong>Pairing lookalikes:</strong> as covered in section 2, near-identical fonts read as mistakes. Contrast deliberately or unify.</li>
        <li><strong>Fixed px everywhere:</strong> pixel sizes ignore user preferences and break zoom. Use <code>rem</code> for type; reserve <code>px</code> for borders and hairlines.</li>
        <li><strong>Gray-on-gray body text:</strong> <code>#999</code> on white might look "refined" in Figma and be unreadable in sunlight. Respect the 4.5:1 ratio for body copy.</li>
        <li><strong>Ignoring the fallback stack:</strong> when the webfont fails (and it will, somewhere), the fallback determines the experience. Specify a real stack — <code>system-ui, -apple-system, "Segoe UI", sans-serif</code> — with matched metrics, not just <code>sans-serif</code>.</li>
        <li><strong>Center-aligning everything:</strong> centered text destroys the left edge readers use to track lines. Center short display lines; left-align (or start-align) everything long-form.</li>
        <li><strong>Forgetting non-Latin scripts:</strong> if your product serves multiple languages, verify the typeface actually covers them — a beautiful Latin face with broken Arabic or CJK fallbacks is a broken experience for those users.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Good typography is invisible — readers notice the message, not the letters. That invisibility is engineered, not accidental: a pairing method that assigns clear roles, a modular scale that gives every size a job, hierarchy levers applied deliberately, readability guarded by measurable rules, and web implementation that respects both performance and real screens. Master these fundamentals and your interfaces won't just look considered — they'll <em>read</em> effortlessly, which is the whole point of putting words on a screen.</p>
    `,
    author: "Fani Adi Frihandoko",
    publishedAt: "2024-01-25",
    tags: ["Typography", "Web Design", "Design Fundamentals"],
    readTime: "14 min read",
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
