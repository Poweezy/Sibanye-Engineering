import { defineCollection, z } from 'astro:content';
import { file } from 'astro/loaders';
import { storyblokLoader } from './storyblok-loader';

const contentSource = import.meta.env.CONTENT_SOURCE || 'json';
if (contentSource !== 'json' && contentSource !== 'storyblok') {
  throw new Error('CONTENT_SOURCE must be either "json" or "storyblok".');
}

const collectionLoader = (filename: string, collection: Parameters<typeof storyblokLoader>[0]) =>
  contentSource === 'storyblok' ? storyblokLoader(collection) : file(filename);

/**
 * Typed content collections.
 *
 * Data currently derives from the approved website proposal and the SES 2026
 * capability statement (as quoted in the proposal). Any field not yet
 * confirmed by SES is stored empty — it is never fabricated. See
 * docs/content-open-items.md for the full integrity register.
 */

const services = defineCollection({
  loader: collectionLoader('src/content/services.json', 'services'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    tagline: z.string(),
    icon: z.string(),
  }),
});

const sectors = defineCollection({
  loader: collectionLoader('src/content/sectors.json', 'sectors'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    title: z.string(),
    icon: z.string(),
    blurb: z.string(),
  }),
});

const projects = defineCollection({
  loader: collectionLoader('src/content/projects.json', 'projects'),
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
    image: z.string().default(''),
  }),
});

const leadership = defineCollection({
  loader: collectionLoader('src/content/leadership.json', 'leadership'),
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
  loader: collectionLoader('src/content/clients.json', 'clients'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    name: z.string(),
  }),
});

export const collections = { services, sectors, projects, leadership, clients };
