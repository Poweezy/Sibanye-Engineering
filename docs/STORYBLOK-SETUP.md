# Storyblok setup

The site remains a static Astro build for cPanel hosting. Storyblok content is
fetched at build time; publishing a Storyblok change does not update the live
site until the site is rebuilt and deployed. The existing JSON files remain the
default source until Storyblok is explicitly enabled.

## 1. Create a Storyblok space

Create a space in Storyblok and note its region. Use the space's **Content
Delivery API** access token, not a Management API token. Do not commit the
token or add a `PUBLIC_` prefix; it is only needed by the build process.

## 2. Create the content types

Create these Storyblok **content type** components, using the technical names
shown. Add the listed fields with the indicated field types. Stories must be
published before a `published` build can read them.

| Technical name | Fields |
| --- | --- |
| `ses_service` | `order` (Number), `title` (Text), `tagline` (Textarea), `icon` (Text) |
| `ses_sector` | `order` (Number), `title` (Text), `icon` (Text), `blurb` (Textarea) |
| `ses_project` | `order` (Number), `title` (Text), `sectors` (Multi-option), `location` (Text), `client` (Text), `value` (Text), `featured` (Boolean), `summary` (Textarea), `image` (Asset) |
| `ses_leader` | `name` (Text), `role` (Text), `credentials` (Multi-option), `bio` (Textarea), `photo` (Asset), `verify` (Boolean) |
| `ses_client` | `order` (Number), `name` (Text) |

Use the existing sector IDs as the `ses_project.sectors` option values:
`water-sanitation`, `energy`, `transportation`, `mining`, `infrastructure`,
`structures`, `industrial-commercial`, `healthcare`, and `agriculture`.
`icon` values must match the icon names already used by the site.

Create one story per entry in the corresponding `src/content/*.json` file.
Use each entry's current `id` as its story slug, including the hyphens. Copy
the current fields without changing unverified content. For multi-option
fields, configure the exact values currently present in the JSON. In
particular, `credentials` should allow every existing credential value.

## 3. Configure the local build

Copy `.env.example` to `.env` and set:

```dotenv
CONTENT_SOURCE=storyblok
STORYBLOK_ACCESS_TOKEN=your-space-delivery-api-token
STORYBLOK_VERSION=published
STORYBLOK_REGION=eu
```

Set `STORYBLOK_REGION` to the region assigned to the space (`eu`, `us`, `ca`,
`ap`, or `cn`). Keep `STORYBLOK_VERSION=published` for public builds. `draft`
is intended only for controlled local checks.

Run `npm run build`. A missing token, invalid CMS response, or field that does
not match the typed collection schema fails the build instead of silently
publishing incomplete content. To return to the existing local JSON content,
set `CONTENT_SOURCE=json` or remove that setting.

## 4. Configure the production build

Add the same four settings to the environment where the static site is built.
Only the content returned by Storyblok is written into the generated site; the
delivery token is not used by browser code. Do not upload `.env` or commit it.
Rebuild and deploy after publishing CMS edits.
