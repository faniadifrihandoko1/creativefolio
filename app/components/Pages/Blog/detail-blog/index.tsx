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
      <p>Clean code is not about making your code work — any code can be made to work. It is about making it <strong>readable by the next person</strong>, who is very often future-you at 2 AM, three months from now, staring at a function you no longer remember writing. Real-world studies of codebases keep landing on the same ratio: code is read roughly ten times more often than it is written. Every minute you spend making code clearer pays for itself many times over — and every shortcut you take charges interest.</p>
      <p>This article goes beyond the usual checklist. We unpack each principle with the reasoning behind it, show concrete before-and-after transformations, and — just as important — talk about when the rules should be bent or broken. Clean code is a judgment skill, not a compliance exercise.</p>

      <h2>What Is Clean Code, Really?</h2>
      <p>Robert C. Martin's famous definition still holds: clean code reads like well-written prose. But let's make it operational. Code is clean when a competent developer can answer three questions quickly: <strong>what</strong> does this do, <strong>why</strong> does it do it this way, and <strong>what breaks</strong> if I change it? If the answers require archaeology — tracing calls across five files, guessing at abbreviations, decoding clever tricks — the code isn't clean, no matter how short or "elegant" it looks.</p>
      <p>Notice what this definition leaves out: brevity. Short code is not automatically clean code. A dense one-liner that takes ten minutes to parse is worse than five obvious lines. Optimize for <strong>reading time, not writing time</strong>.</p>

      <h2>1. Meaningful Names: the Cheapest Documentation You Have</h2>
      <p>Names are the highest-bandwidth channel you have for communicating intent. A good name makes a comment unnecessary; a bad name makes even correct code suspicious. The rule is simple: a name should reveal <strong>why it exists, what it does, and how it is used</strong>. If a name needs a comment to explain it, the name has failed.</p>
      <pre><code>// Bad: what do these mean?
const d = new Date();
const u = getUsers();
function proc(x, y) { /* ... */ }

// Good: intent is obvious
const currentDate = new Date();
const activeUsers = getActiveUsers();
function calculateDiscountedPrice(price, discountRate) { /* ... */ }</code></pre>
      <p>A few naming rules that pay off forever:</p>
      <ul>
        <li><strong>Be precise, not just descriptive.</strong> <code>getUsers()</code> is descriptive; <code>getActiveUsers()</code> is precise. Precision kills whole classes of misunderstanding.</li>
        <li><strong>Avoid mental mapping.</strong> Single letters (<code>d</code>, <code>u</code>, <code>x</code>) force the reader to keep a translation table in their head. The only acceptable single-letter names are loop counters and well-established math conventions.</li>
        <li><strong>Don't encode types in names.</strong> <code>strName</code> or <code>userArr</code> are Hungarian-notation leftovers. Types change; the lie in the name stays.</li>
        <li><strong>Use searchable names.</strong> You can't find every use of <code>d</code> in a codebase. You can find every use of <code>invoiceDueDate</code>.</li>
        <li><strong>Pick one word per concept.</strong> Don't mix <code>fetch</code>, <code>retrieve</code>, and <code>get</code> for the same operation. Consistency in vocabulary is consistency in thought.</li>
      </ul>

      <h2>2. Small, Focused Functions: Do One Thing</h2>
      <p>A function should do one thing, do it well, and do it only. "One thing" means one level of abstraction: a function either orchestrates high-level steps or implements a low-level detail, never both. When you read a function top to bottom and each line feels like it's at the same altitude, the function is the right size. When it jumps from "validate the order" to "parse this date string character by character," it needs splitting.</p>
      <pre><code>// Bad: three levels of abstraction in one function
function handleCheckout(cart, user) {
  if (!cart.items.length) throw new Error("empty");
  let total = 0;
  for (const item of cart.items) {          // low-level math...
    total += item.price * item.qty * (1 - item.discount);
  }
  const receipt = {                          // ...mixed with orchestration
    userId: user.id,
    total: Math.round(total * 100) / 100,
    date: new Date().toISOString().slice(0, 10),
  };
  db.save("receipts", receipt);              // ...and persistence
  sendEmail(user.email, "Receipt", JSON.stringify(receipt));
  return receipt;
}

// Good: one level of abstraction per function
function handleCheckout(cart, user) {
  validateCart(cart);
  const receipt = createReceipt(cart, user);
  saveReceipt(receipt);
  sendReceiptEmail(user.email, receipt);
  return receipt;
}</code></pre>
      <p>The refactored version reads like a summary of what happens — each helper can be understood (and tested) in isolation. As a rule of thumb: if you can't describe what a function does without using the word "and," it's doing more than one thing. And keep functions short enough that you rarely need to scroll: 20 lines is a smell, 50 is a problem.</p>

      <h2>3. DRY — But Don't Abstract Too Early</h2>
      <p>Duplication is the root of a specific evil: when one concept lives in three places, changing it means finding all three — and you will miss one. But the cure can be worse than the disease. An abstraction built from two similar-looking pieces of code often turns out to be wrong, and a wrong abstraction is harder to fix than duplication, because now the two use cases are coupled through a shared lie.</p>
      <pre><code>// Duplication: tolerable, honest
function renderUserCard(user) { /* avatar + name + role */ }
function renderAdminCard(admin) { /* avatar + name + role + badge */ }

// Wrong abstraction: couples things that merely look alike
function renderCard(entity, { showBadge, badgeLabel, theme, layout }) {
  // 40 lines of conditionals trying to serve both masters
}</code></pre>
      <p>The pragmatic rule is the <strong>rule of three</strong>: the first time you write something, just write it. The second time, notice the duplication but tolerate it. The third time, you finally understand the real pattern — now abstract. Premature abstraction guesses at the pattern; the rule of three waits until the pattern reveals itself.</p>

      <h2>4. Comments: Explain Why, Never What</h2>
      <p>The best comment is the one you didn't need to write because the code says it. Comments that restate the code are noise — worse, they rot. Code gets updated; comments get forgotten. A comment that contradicts the code is actively dangerous, because readers trust the comment and misread the code.</p>
      <pre><code>// Bad: restates the obvious, will rot
// increment i by 1
i++;

// Bad: the lie that outlives the code
// returns users sorted by name (it hasn't since 2022)
return users.sort(byCreatedAt);

// Good: explains the why that code cannot show
// Stripe requires idempotency keys to be unique per 24h window,
// otherwise retries create duplicate charges.
const key = "charge-" + orderId + "-" + dayTimestamp();</code></pre>
      <p>Write comments for <strong>intent, non-obvious constraints, and warnings</strong>: why this workaround exists, what external system forces this shape, what will break if someone "simplifies" this. Delete the rest. And treat TODO comments as debt with an owner and a date — an orphaned TODO is just a wish.</p>

      <h2>5. Handle Errors Honestly</h2>
      <p>Nothing destroys trust in a codebase faster than swallowed errors. An empty <code>catch</code> block doesn't fix a failure; it converts a loud, debuggable failure into a silent, mysterious one three layers up the stack. If you can't handle an error meaningfully at this level, <strong>don't catch it</strong> — let it propagate to someone who can.</p>
      <pre><code>// Bad: the silent lie
try {
  chargeCustomer(order);
} catch (e) {} // "it usually works"

// Good: handle what you can, propagate the rest
try {
  chargeCustomer(order);
} catch (e) {
  if (e instanceof NetworkError) {
    retryQueue.add(order); // transient: retry later
  } else {
    logger.error("Payment failed", { orderId: order.id, cause: e });
    throw e; // permanent: fail loudly, upstream decides
  }
}</code></pre>
      <p>Two more habits: prefer exceptions over error codes for exceptional conditions (error codes get ignored; exceptions can't be), and never return <code>null</code> where an empty collection or an explicit result type would do — <code>null</code> just moves the crash to whoever forgot the check.</p>

      <h2>6. Formatting: the Visual Contract of a Team</h2>
      <p>Formatting is the least intellectual and most underrated of the clean-code disciplines. Inconsistent indentation, random line breaks, and mixed styles create visual noise that slows every reader down. The fix is boring on purpose: <strong>automate it</strong>. A formatter (Prettier, Black, gofmt) plus a linter, run on every commit, ends all formatting debates permanently.</p>
      <p>Automated formatting isn't about the "right" style — it's about <strong>zero</strong> style discussions. Every minute a team spends arguing about semicolons in code review is a minute not spent discussing actual logic. Let the tool decide; save human judgment for things tools can't judge.</p>

      <h2>When to Break the Rules</h2>
      <p>Clean code is a default, not a dogma. There are legitimate reasons to deviate — the key is that the deviation should be <strong>deliberate and documented</strong>, not accidental.</p>
      <ul>
        <li><strong>Performance hotspots:</strong> the cleanest abstraction sometimes costs a measurable amount in a tight loop. Optimize the hotspot, keep it small, and comment exactly why it's written that way — with the benchmark numbers.</li>
        <li><strong>Throwaway code:</strong> a one-off migration script that runs once doesn't need the same care as a core domain module. Match the investment to the code's lifespan.</li>
        <li><strong>Deadlines:</strong> sometimes you ship the ugly version to hit a date. That's fine — if you file the cleanup as a tracked task immediately. "Temporary" code without a ticket is permanent.</li>
        <li><strong>External constraints:</strong> legacy APIs, generated code, and framework conventions sometimes force awkward shapes. Isolate the awkwardness behind a clean boundary so it doesn't infect the rest.</li>
      </ul>
      <p>The test is always the same: would the next reader understand <em>why</em> this deviates? If yes, it's pragmatism. If no, it's just mess.</p>

      <h2>Common Traps</h2>
      <p>A few failure modes experienced developers keep falling into:</p>
      <ul>
        <li><strong>Clever code:</strong> nested ternaries, bitwise tricks, regex golf. If it feels clever while writing, it will feel hostile while reading. Boring code is a feature.</li>
        <li><strong>Over-abstraction:</strong> interfaces with one implementation, factories for objects created once, "flexibility" for requirements that don't exist. Build for the requirements you have; YAGNI (You Aren't Gonna Need It) is real.</li>
        <li><strong>Premature patterns:</strong> forcing every problem into the design pattern you just learned. Patterns are vocabulary for communicating solutions, not a checklist to apply.</li>
        <li><strong>Refactoring without tests:</strong> restructuring code you can't verify is just rearranging risk. The safety net comes first, the cleanup second.</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Writing clean code is an investment with compound interest. Meaningful names, small focused functions, honest error handling, and automated formatting don't just make code prettier — they make it <strong>cheaper to change</strong>, and software's whole game is changing. Start with one habit: the next time you write a function, read it back and ask whether a stranger could understand it in thirty seconds. That single question, applied consistently, will transform your code more than any tool or framework.</p>
    `,
    author: "Fani Adi Frihandoko",
    publishedAt: "2024-01-10",
    tags: ["Programming", "Best Practices", "Code Quality"],
    readTime: "14 min read",
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
      <p>Performance is a feature — and unlike most features, users notice it only when it's missing. A page that takes three seconds to become interactive doesn't just feel slow; it converts worse, ranks worse, and retains worse. Google's Core Web Vitals made this explicit: <strong>INP</strong> (responsiveness), <strong>LCP</strong> (loading), and <strong>CLS</strong> (visual stability) now directly influence search ranking. But here's the uncomfortable truth most optimization guides skip: most React apps aren't slow because of React. They're slow because of decisions — fetching waterfalls, megabyte bundles, and re-renders nobody measured.</p>
      <p>This guide is structured around a discipline, not a trick list. We start with <strong>measuring</strong>, because unmeasured optimization is superstition. Then we work through each technique — memoization, code splitting, lazy loading, virtualization, render hygiene, bundle diet, and data-fetching patterns — with concrete before-and-after code and an honest account of what each technique costs. We close with the trap that catches even senior engineers: premature optimization.</p>

      <h2>Measure First: Profiling Before Optimizing</h2>
      <p>Never optimize on intuition. React DevTools' <strong>Profiler</strong> tab records exactly which components rendered, how long each took, and why they re-rendered (props change? state change? parent re-render?). The workflow is always the same: record an interaction, find the longest bars, fix those, re-measure. If a component renders in 2ms, memoizing it is theater — your time is better spent on the 200ms bar next to it.</p>
      <p>For production reality, instrument the field, not just your laptop. Core Web Vitals from real users (via the <code>web-vitals</code> library or your analytics) tell you what lab tests can't: slow networks, weak devices, and long sessions. A good target: <strong>LCP under 2.5s, INP under 200ms, CLS under 0.1</strong> for the 75th percentile of users. Optimize the metric your users actually fail, not the one that's easiest to demo.</p>

      <h2>1. Memoization: Skip Work You've Already Done</h2>
      <p>React re-renders a component whenever its parent re-renders, even if nothing relevant changed. Memoization breaks that chain at three levels: <code>React.memo</code> skips re-rendering a component when props are shallow-equal, <code>useMemo</code> caches an expensive computed value, and <code>useCallback</code> keeps a function reference stable so memoized children don't see a "new" prop every render.</p>
      <pre><code>// Before: every keystroke in the search box re-renders the whole list
function ProductPage({ products }) {
  const [query, setQuery] = useState("");
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) // runs on EVERY render
  );
  return (
    &lt;&gt;
      &lt;SearchInput value={query} onChange={setQuery} /&gt;
      &lt;ProductGrid items={filtered} onSelect={(p) => showDetail(p)} /&gt;
    &lt;/&gt;
  );
}

// After: filter only when inputs change; grid only re-renders when items change
const ProductGrid = React.memo(function ProductGrid({ items, onSelect }) {
  return items.map(p => &lt;ProductCard key={p.id} product={p} onSelect={onSelect} /&gt;);
});

function ProductPage({ products }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() =>
    products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())),
    [products, query]
  );
  const showDetail = useCallback((p) => openModal(p.id), []);
  return (
    &lt;&gt;
      &lt;SearchInput value={query} onChange={setQuery} /&gt;
      &lt;ProductGrid items={filtered} onSelect={showDetail} /&gt;
    &lt;/&gt;
  );
}</code></pre>
      <p><strong>Impact:</strong> typing in the search box no longer re-renders hundreds of product cards — only the input updates until the query actually changes the filtered list. On a 500-item grid this routinely turns a janky 300ms keystroke into a smooth 16ms one.</p>
      <p><strong>When to use it:</strong> expensive computations derived from props/state, large lists re-rendered by unrelated parent state, and components deep in a tree that re-render often. <strong>When NOT to:</strong> cheap components (memoization itself costs memory and comparison time), and unstable dependencies — a <code>useMemo</code> with an object recreated every render never hits its cache and just adds overhead. Measure first; memoize the hot path.</p>

      <h2>2. Code Splitting: Ship Less, Then Ship the Rest Later</h2>
      <p>Every byte of JavaScript you ship must be downloaded, parsed, and executed before the page becomes interactive. Code splitting breaks the bundle into chunks loaded on demand, so the user pays only for the code of the route they're actually on. Route-level splitting is the highest-leverage split you can make — most users visit a fraction of your routes.</p>
      <pre><code>// Before: one giant bundle — admin panel ships to every visitor
import AdminPanel from "./AdminPanel";
import SettingsPage from "./SettingsPage";

function App() {
  return (
    &lt;Routes&gt;
      &lt;Route path="/" element={&lt;Home /&gt;} /&gt;
      &lt;Route path="/admin" element={&lt;AdminPanel /&gt;} /&gt;
      &lt;Route path="/settings" element={&lt;SettingsPage /&gt;} /&gt;
    &lt;/Routes&gt;
  );
}

// After: each route loads only when visited
const AdminPanel = React.lazy(() => import("./AdminPanel"));
const SettingsPage = React.lazy(() => import("./SettingsPage"));

function App() {
  return (
    &lt;Routes&gt;
      &lt;Route path="/" element={&lt;Home /&gt;} /&gt;
      &lt;Route
        path="/admin"
        element={
          &lt;Suspense fallback={&lt;PageSkeleton /&gt;}&gt;
            &lt;AdminPanel /&gt;
          &lt;/Suspense&gt;
        }
      /&gt;
      {/* ... */}
    &lt;/Routes&gt;
  );
}</code></pre>
      <p><strong>Impact:</strong> the initial bundle drops by everything the admin and settings routes pulled in — often 30–60% of a dashboard app's JavaScript. LCP and time-to-interactive improve directly because there's less to download and parse. In Next.js, this is automatic per route via the App Router; use <code>next/dynamic</code> for component-level splits.</p>
      <p><strong>When to use it:</strong> routes visited by a minority of users, heavy features (charts, rich text editors, PDF viewers), and anything below a user interaction (modals, drawers). <strong>Watch out:</strong> splitting too aggressively creates waterfall loading — a chunk that imports another chunk that imports another. Keep shared dependencies in the main chunk and prefetch routes on hover/link visibility for instant navigation.</p>

      <h2>3. Lazy Loading: Defer What's Below the Fold</h2>
      <p>Images are usually the largest bytes on a page, and most of them start below the fold where nobody sees them yet. Native lazy loading costs one attribute; for framework images, use the optimized component.</p>
      <pre><code>// Before: 2MB of images download before the hero is even visible
&lt;img src="/team-photo.jpg" alt="Team" /&gt;
&lt;img src="/office-1.jpg" alt="Office" /&gt;
&lt;img src="/office-2.jpg" alt="Office" /&gt;

// After: below-fold images wait their turn; hero loads fast and stable
&lt;Image
  src="/hero.jpg" alt="Hero"
  priority                    // LCP image: load eagerly...
  sizes="100vw"               // ...at the right resolution
/&gt;
&lt;Image src="/team-photo.jpg" alt="Team" loading="lazy" placeholder="blur" /&gt;</code></pre>
      <p><strong>Impact:</strong> initial page weight can drop by megabytes, LCP improves because the browser prioritizes the hero image instead of competing with ten offscreen ones, and <code>placeholder="blur"</code> plus explicit dimensions prevent layout shift (CLS). <strong>When to use it:</strong> any image not visible on first paint, infinite-scroll feeds, and heavy embeds (videos, maps, iframes) — defer the embed until the user scrolls near or clicks.</p>

      <h2>4. Virtualization: Render the Visible, Skip the Rest</h2>
      <p>A list of 10,000 rows creates 10,000 DOM nodes — and DOM nodes are expensive. Virtualization renders only the rows in (and slightly around) the viewport, recycling nodes as the user scrolls. The user can't tell the difference; the browser absolutely can.</p>
      <pre><code>// Before: 10,000 rows in the DOM — scroll jank, huge memory
function BigTable({ rows }) {
  return (
    &lt;div&gt;{rows.map(r => &lt;Row key={r.id} data={r} /&gt;)}&lt;/div&gt;
  );
}

// After: only ~30 rows exist in the DOM at any moment
import { FixedSizeList } from "react-window";

function BigTable({ rows }) {
  return (
    &lt;FixedSizeList height={600} itemCount={rows.length} itemSize={48} width="100%"&gt;
      {({ index, style }) => &lt;Row style={style} data={rows[index]} /&gt;}
    &lt;/FixedSizeList&gt;
  );
}</code></pre>
      <p><strong>Impact:</strong> DOM node count drops from tens of thousands to dozens — scroll goes from stuttering to 60fps and memory usage collapses. <strong>When to use it:</strong> lists beyond a few hundred rows, chat histories, logs, data tables. Below ~100 simple rows, plain rendering is fine and simpler.</p>

      <h2>5. Render Hygiene: Stop Re-renders at the Source</h2>
      <p>Memoization treats the symptom; render hygiene treats the cause. The most common cause is <strong>state placed too high</strong>: a single state atom at the page root re-renders the entire page on every change. Colocate state with the component that uses it, and split components so expensive subtrees aren't children of frequently-updating parents.</p>
      <pre><code>// Before: typing re-renders the entire dashboard, including heavy charts
function Dashboard() {
  const [filter, setFilter] = useState("");
  return (
    &lt;&gt;
      &lt;FilterBar value={filter} onChange={setFilter} /&gt;
      &lt;ExpensiveCharts /&gt;   // re-renders on every keystroke!
      &lt;DataTable filter={filter} /&gt;
    &lt;/&gt;
  );
}

// After: charts are siblings of the stateful subtree, untouched by typing
function Dashboard() {
  return (
    &lt;&gt;
      &lt;FilterableSection /&gt;  // owns filter state internally
      &lt;ExpensiveCharts /&gt;    // never re-renders from typing
    &lt;/&gt;
  );
}</code></pre>
      <p><strong>Impact:</strong> keystrokes update only the filter subtree — charts and other heavy siblings stay put. This single restructuring often beats a dozen <code>React.memo</code> wrappers. Related habits: give lists stable <code>key</code> props (never array indices for reorderable data — wrong keys cause full re-mounts), and lift content that doesn't depend on state out of the render path entirely.</p>

      <h2>6. The Bundle Diet: Audit What You Ship</h2>
      <p>You can't fix what you can't see. Run <code>webpack-bundle-analyzer</code> (or Next.js's <code>@next/bundle-analyzer</code>) and look at the biggest rectangles: they're usually a date library imported wholesale, an icon pack pulling 2,000 icons for 12 used, or two versions of the same dependency.</p>
      <pre><code># visualize what's actually in your bundle
npm install --save-dev @next/bundle-analyzer
# then: ANALYZE=true npm run build

// Before: 70KB of date library for one format call
import moment from "moment";
moment(date).format("MMM D");

// After: tree-shaken import, ~2KB
import { format } from "date-fns";
format(date, "MMM d");</code></pre>
      <p><strong>Impact:</strong> these swaps are pure win — same behavior, a fraction of the bytes, no runtime cost at all. Make bundle analysis part of CI: fail the build when the bundle grows past a budget, so regressions get caught at PR time instead of discovered by users months later.</p>

      <h2>7. Data Fetching: Kill the Waterfall</h2>
      <p>The slowest pattern in React apps isn't rendering — it's <strong>sequential network requests</strong>. Component A fetches, renders, then child B fetches, renders, then child C fetches. Three 200ms requests become 600ms+ of blank or skeleton UI. Fetch in parallel where data is independent, and fetch as high (as early) as the data is known.</p>
      <pre><code>// Before: waterfall — each await blocks the next
async function getDashboardData(userId) {
  const user = await fetchUser(userId);        // 200ms
  const orders = await fetchOrders(user.id);   // +200ms
  const prefs = await fetchPrefs(user.id);     // +200ms = 600ms total
  return { user, orders, prefs };
}

// After: independent requests fly together
async function getDashboardData(userId) {
  const user = await fetchUser(userId);        // 200ms
  const [orders, prefs] = await Promise.all([ // +200ms = 400ms total
    fetchOrders(user.id),
    fetchPrefs(user.id),
  ]);
  return { user, orders, prefs };
}</code></pre>
      <p><strong>Impact:</strong> wall-clock latency drops from the <em>sum</em> of requests to the <em>maximum</em> of the parallel ones. In frameworks with server components, colocate data fetching with the component that needs it and let the framework parallelize and stream — but keep the mental model: draw your request timeline, and eliminate the stairs.</p>

      <h2>The Premature Optimization Trap</h2>
      <p>Every technique above has a cost: memoization adds comparison overhead and stale-closure bugs, code splitting adds loading states and waterfall risk, virtualization adds complexity and breaks find-in-page. Optimizing without measuring means paying real complexity costs for imaginary performance gains — and the resulting "optimized" code is harder to change, which makes the <em>next</em> optimization harder too.</p>
      <p>The discipline is simple and non-negotiable: <strong>measure → fix the biggest bottleneck → re-measure → stop when it's fast enough</strong>. "Fast enough" is defined by your users' metrics, not by engineering pride. A page with INP of 80ms doesn't need memoization, no matter how satisfying it feels to add. Save the cleverness for the profiler's longest bar.</p>

      <h2>Conclusion</h2>
      <p>React performance is a pipeline: ship less JavaScript (code splitting, bundle diet), defer what isn't needed yet (lazy loading), render less often (memoization, render hygiene, virtualization), and wait less on the network (parallel fetching). But the pipeline only works when it's driven by measurement. Profile in the lab, monitor in the field, fix the biggest bar, and stop when the metrics say your users are happy. Performance optimization isn't a phase you finish — it's a budget you defend, one PR at a time.</p>
    `,
    author: "Sarah Wilson",
    publishedAt: "2024-01-01",
    tags: ["React", "Performance", "Optimization"],
    readTime: "15 min read",
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
