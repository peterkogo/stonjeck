import groq from 'groq';
import { createServerClient } from './client';
import { SANITY_API_READ_TOKEN } from '$env/static/private';
import type { Series } from './types';

const serverClient = createServerClient(SANITY_API_READ_TOKEN);

const allSeriesQuery = groq`
  *[_type == "series"] | order(order desc) {
    slug,
    title,
    order,
  }
`;
export async function getAllSeries(): Promise<Series[]> {
	return await serverClient.fetch(allSeriesQuery);
}

const seriesBySlugQuery = groq`
*[_type == "series" && slug.current == $slug][0] {
  title,
  year,
  slug,
  description,
  works[]-> {
    slug,
    title,
    image,
    date,
    size,
    description,
    medium-> {
      name
    }
  }
}
`;

export async function getSeriesBySlug(slug: string): Promise<Series> {
	return await serverClient.fetch(seriesBySlugQuery, { slug });
}
