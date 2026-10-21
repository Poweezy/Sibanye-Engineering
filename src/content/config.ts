import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';

/**
 * Typed content collections.
 *
 * Data currently derives from the approved website proposal and the SES 2026
 * capability statement (as quoted in the proposal). Any field not yet
 * confirmed by SES is stored empty — it is never fabricated. See
 * docs/content-open-items.md for the full integrity register.
 */

const services = defineCollection({
  loader: file('src/content/services.json'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    tagline: z.string(),
    icon: z.string(),
  }),
});

const sectors = defineCollection({
  loader: file('src/content/sectors.json'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    icon: z.string(),
    blurb: z.string(),
  }),
});

const projects = defineCollection({
  loader: file('src/content/projects.json'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    sectors: z.array(z.string()).default([]),
    location: z.string().default(''),
    client: z.string().default(''),
    value: z.string().default(''),
    featured: z.boolean().default(false),
    summary: z.string().default(''),
  }),
});

const leadership = defineCollection({
  loader: file('src/content/leadership.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    credentials: z.array(z.string()).default([]),
    bio: z.string().default(''),
    photo: z.string().default(''),
    verify: z.boolean().default(true),
  }),
});

const clients = defineCollection({
  loader: file('src/content/clients.json'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    name: z.string(),
  }),
});

export const collections = { services, sectors, projects, leadership, clients };
