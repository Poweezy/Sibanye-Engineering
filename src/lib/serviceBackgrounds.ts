/**
 * Per-discipline engineering background imagery (ADR-024).
 *
 * Maps services confirmed in src/content/services.json to the SES-approved
 * generative backdrop library (public/images/engineering-backgrounds/).
 * decorative use only: never captioned as documentary photography, never
 * implying a completed project.
 */
export const serviceBackgrounds: Record<string, string> = {
  'civil-engineering': '/images/engineering-backgrounds/engineering-bg-structural.webp',
  'water-sanitation': '/images/engineering-backgrounds/engineering-bg-water.webp',
  transportation: '/images/engineering-backgrounds/engineering-bg-transport.webp',
  energy: '/images/engineering-backgrounds/engineering-bg-energy.webp',
  'structural-engineering': '/images/engineering-backgrounds/engineering-bg-structural.webp',
  'mining-engineering': '/images/engineering-backgrounds/engineering-bg-mining.webp',
  'project-programme-management': '/images/engineering-backgrounds/engineering-bg-coordination.webp',
  'industrial-commercial-buildings': '/images/engineering-backgrounds/engineering-bg-structural.webp',
};

export const sectorBackgrounds: Record<string, string> = {
  'water-sanitation': '/images/engineering-backgrounds/engineering-bg-water.webp',
  energy: '/images/engineering-backgrounds/engineering-bg-energy.webp',
  transportation: '/images/engineering-backgrounds/engineering-bg-transport.webp',
  mining: '/images/engineering-backgrounds/engineering-bg-mining.webp',
  infrastructure: '/images/engineering-backgrounds/engineering-bg-coordination.webp',
  structures: '/images/engineering-backgrounds/engineering-bg-structural.webp',
  'industrial-commercial': '/images/engineering-backgrounds/engineering-bg-structural.webp',
  healthcare: '/images/engineering-backgrounds/engineering-bg-coordination.webp',
  agriculture: '/images/engineering-backgrounds/engineering-bg-water.webp',
};