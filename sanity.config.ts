"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schema";
import { structure } from "./sanity/structure";
import { theme } from "./sanity/theme";
import { Logo } from "./sanity/components/Logo";
import { FeaturedBadge, NoCoverBadge } from "./sanity/components/DocumentBadges";
import { codeInput } from "@sanity/code-input";

export default defineConfig({
  name: "fanidev-cms",
  title: "FANIDEV CMS",
  icon: Logo,
  theme,
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  plugins: [
    structureTool({ structure }),
    codeInput(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    badges: (prev) => [...prev, FeaturedBadge, NoCoverBadge],
  },
});
