import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: 'https://xemtuvi.vn/', changeFrequency: 'weekly', priority: 1 },
    { url: 'https://xemtuvi.vn/lp/van-nam-2027', changeFrequency: 'monthly', priority: 0.8 }];
}
