import { defineQuery } from 'groq';
import { createServerClient } from './client';

const serverClient = createServerClient();

const allSeriesQuery = defineQuery(`
  *[_type == "series"] | order(order desc) {
    slug,
    "title": coalesce(
      title[_key == $language][0].value,
      title[_key == "de"][0].value,
      "Missing translation"
    ),
    order,
  }
`);

export async function getAllSeries(language: string) {
	return await serverClient.fetch(allSeriesQuery, { language });
}

const seriesBySlugQuery = defineQuery(`
*[_type == "series" && slug.current == $slug][0] {
  "title": coalesce(
    title[_key == $language][0].value,
    title[_key == "de"][0].value,
    "Missing translation"
  ),
  year,
  slug,
  description,
  works[]-> {
    slug,
    "title": coalesce(
      title[_key == $language][0].value,
      title[_key == "de"][0].value,
      "Missing translation"
    ),
    image {
      ...,
      asset->{
        ...,
        metadata{
          blurHash,
          dimensions
        }
      }
    },
    date,
    size,
    description,
    medium-> {
      "name": coalesce(
        name[_key == $language][0].value,
        name[_key == "de"][0].value,
        "Missing translation"
      ),
    }
  }
}
`);

export async function getSeriesBySlug(slug: string, language: string) {
	return await serverClient.fetch(seriesBySlugQuery, { slug, language });
}

const informationQuery = defineQuery(`
*[_type == "information"][0] {
  _id,
  _type,
  "biography": coalesce(
    biography[_key == $language][0].value,
    biography[_key == "de"][0].value,
    "Missing translation"
  ),
  impressum
}
`);

export async function getInformation(language: string) {
	return await serverClient.fetch(informationQuery, { language });
}
