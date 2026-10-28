/**
 * Per-discipline engineering background imagery (ADR-024).
 *
 * Maps services confirmed in src/content/services.json to the SES-approved
 * generative backdrop library (public/images/engineering-backgrounds/).
 * Decorative use only: never captioned as documentary photography, never
 * implying a completed project. Mining has no dedicated asset — it shares the
 * neutral abstract texture rather than borrowing a discipline-specific image.
 */
export const serviceBackgrounds: Record<string, string> = {
  'civil-engineering': '/images/engineering-backgrounds/engineering-bg-structural.webp',
  'water-sanitation': '/images/engineering-backgrounds/engineering-bg-water.webp',
  transportation: '/images/engineering-backgrounds/engineering-bg-transport.webp',
  energy: '/images/engineering-backgrounds/engineering-bg-energy.webp',
  'structural-engineering': '/images/engineering-backgrounds/engineering-bg-structural.webp',
  'mining-engineering': '/images/engineering-backgrounds/engineering-bg-texture.webp',
  'project-programme-management': '/images/engineering-backgrounds/engineering-bg-coordination.webp',
  'industrial-commercial-buildings': '/images/engineering-backgrounds/engineering-bg-structural.webp',
};

export const sectorBackgrounds: Record<string, string> = {
  'water-sanitation': '/images/engineering-backgrounds/engineering-bg-water.webp',
  energy: '/images/engineering-backgrounds/engineering-bg-energy.webp',
  transportation: '/images/engineering-backgrounds/engineering-bg-transport.webp',
  mining: '/images/engineering-backgrounds/engineering-bg-texture.webp',
  infrastructure: '/images/engineering-backgrounds/engineering-bg-coordination.webp',
  structures: '/images/engineering-backgrounds/engineering-bg-structural.webp',
  'industrial-commercial': '/images/engineering-backgrounds/engineering-bg-structural.webp',
  healthcare: '/images/engineering-backgrounds/engineering-bg-coordination.webp',
  agriculture: '/images/engineering-backgrounds/engineering-bg-water.webp',
};