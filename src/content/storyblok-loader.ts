import StoryblokClient, { type ISbStoryData } from 'storyblok-js-client';

type StoryblokContent = Record<string, unknown> & {
  component?: string;
};

type StoryblokStory = ISbStoryData<StoryblokContent> & {
  is_folder?: boolean;
};

type CollectionEntryData = Record<string, unknown> & {
  id: string;
};

const collectionContentTypes = {
  services: 'ses_service',
  sectors: 'ses_sector',
  projects: 'ses_project',
  leadership: 'ses_leader',
  clients: 'ses_client',
} as const;

type CollectionName = keyof typeof collectionContentTypes;

function assetUrl(value: unknown, storySlug: string, field: string): string {
  if (value === undefined || value === null || value === '') return '';
  if (typeof value === 'string') return value;
  if (
    typeof value === 'object' &&
    'filename' in value &&
    typeof value.filename === 'string'
  ) {
    return value.filename;
  }
  throw new Error(`Storyblok story "${storySlug}" has an invalid "${field}" asset.`);
}

function toCollectionEntry(story: StoryblokStory, collection: CollectionName): CollectionEntryData {
  if (!story.slug || !story.content || typeof story.content !== 'object') {
    throw new Error(`Storyblok returned an invalid ${collection} story.`);
  }

  const data: CollectionEntryData = {
    ...story.content,
    id: story.slug,
  };

  if (collection === 'services' || collection === 'sectors' || collection === 'projects') {
    if (typeof data.title !== 'string' || data.title.trim() === '') {
      data.title = story.name;
    }
  }
  if (collection === 'leadership' && (typeof data.name !== 'string' || data.name.trim() === '')) {
    data.name = story.name;
  }
  if (collection === 'clients' && (typeof data.name !== 'string' || data.name.trim() === '')) {
    data.name = story.name;
  }
  if (collection === 'projects') {
    data.image = assetUrl(data.image, story.slug, 'image');
  }
  if (collection === 'leadership') {
    data.photo = assetUrl(data.photo, story.slug, 'photo');
  }

  return data;
}

export function storyblokLoader(collection: CollectionName) {
  return async () => {
    const token = import.meta.env.STORYBLOK_ACCESS_TOKEN;
    if (!token) {
      throw new Error(
        'CONTENT_SOURCE is "storyblok", but STORYBLOK_ACCESS_TOKEN is not set. See docs/STORYBLOK-SETUP.md.',
      );
    }

    const version = import.meta.env.STORYBLOK_VERSION || 'published';
    if (version !== 'published' && version !== 'draft') {
      throw new Error('STORYBLOK_VERSION must be either "published" or "draft".');
    }

    const region = import.meta.env.STORYBLOK_REGION || 'eu';
    const client = new StoryblokClient({ accessToken: token, region });
    const stories = await client.getAll('cdn/stories', {
      content_type: collectionContentTypes[collection],
      per_page: 100,
      version,
    });

    return stories
      .filter((story: StoryblokStory) => !story.is_folder)
      .map((story: StoryblokStory) => toCollectionEntry(story, collection));
  };
}
