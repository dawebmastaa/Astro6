import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const pages = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
	schema: z.object({
		// Basic metadata
		title: z.string(),
		description: z.string(),
		robots: z.string().default("index, follow"),
		draft: z.boolean().default(false),
		excerpt: z.string().optional(),

		// Navigation and display
		navOrder: z.number().default(100),
		hideFromNav: z.boolean().default(true),

		// Hero section
		heroImage: z.string().optional(),
		imageAlt: z.string().optional(),
		headingText: z.string().optional(),
		headingText2: z.string().optional(),
		heroExcerpt: z.string().optional(),
		footerText: z.string().optional(),

		// Call-to-action buttons
		ctaText: z.string().optional(),
		ctaLink: z.string().optional(),
		cta2Text: z.string().optional(),
		cta2Link: z.string().optional(),
	}),
});

const articles = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/articles" }),
	schema: z.object({
		// Basic metadata
		title: z.string(),
		description: z.string(),
		robots: z.string().default("index, follow"),
		draft: z.boolean().default(false),

		// Content
		excerpt: z.string().optional(),

		// Dates
		publishDate: z.coerce.date().default(() => new Date()),
		updateDate: z.coerce.date().optional(),

		// Authorship
		author: z.string().optional(),

		// Hero section
		heroImage: z.string().optional(),
		imageAlt: z.string().optional(),
		headingText: z.string().optional(),
		headingText2: z.string().optional(),
		footerText: z.string().optional(),

		// Article metadata
		category: z.string().optional(),
		featured: z.boolean().default(false),

		featuredImage: z.string().optional(),
	}),
});

const blog = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
	schema: z.object({
		// Basic metadata
		title: z.string(),
		description: z.string(),
		robots: z.string().default("index, follow"),
		draft: z.boolean().default(false),

		// Content
		excerpt: z.string(),

		// Dates
		publishDate: z.coerce.date().default(() => new Date()),
		updateDate: z.coerce.date().optional(),

		// Authorship
		author: z.string().optional(),

		// Display options
		headingText: z.string().optional(),
		headingText2: z.string().optional(),
		footerText: z.string().optional(),

		// Images
		heroImage: z.string().optional(),
		imageAlt: z.string().optional(),
		featuredImage: z.string().optional(),

		// Tags and featured status
		tags: z.array(z.string()).default([]),
		featured: z.boolean().default(false),
	}),
});

export const collections = { pages, articles, blog };
