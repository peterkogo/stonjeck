import { error } from '@sveltejs/kit';
import { defineQuery } from 'groq';
import { prerender } from '$app/server';

import { sanityClient } from '$lib/sanity/client';
import { buildTagIndex } from '$lib/works/tag-index';

const tagsQuery = defineQuery(`
	*[_type == "tag"] | order(group asc, slug.current asc) {
		_id,
		name,
		slug,
		group
	}
`);

export const getTags = prerender(async () => {
	return await sanityClient.fetch(tagsQuery);
});

const worksQuery = defineQuery(`
	*[_type == "work"] | order(date desc) {
		_id,
		slug,
		title,
		image {
			hotspot,
			crop,
			asset->{
				_id,
				metadata {
					lqip,
					dimensions {
						width,
						height,
						aspectRatio
					}
				}
			}
		},
		date,
		size,
		tags[]-> {
			_id,
			slug,
			group
		},
		medium-> {
			name
		}
	}
`);

const newsWorkIdsQuery = defineQuery(`
	*[_type == "news"][0].works[]._ref
`);

const newsEventsQuery = defineQuery(`
	*[_type == "news"][0].events[]-> {
		_id,
		title,
		startDate,
		endDate,
		venue { name, city },
		poster {
			alt,
			hotspot,
			crop,
			asset->{
				_id,
				metadata { lqip, dimensions { width, height, aspectRatio } }
			}
		}
	}
`);

const informationQuery = defineQuery(`
	*[_type == "information"][0] {
		_id,
		_type,
		titleImage-> {
			image {
				...,
				asset->{
					...,
					metadata{
						lqip,
						dimensions
					}
				}
			}
		},
		biography,
		impressum
	}
`);

export const getWorks = prerender(async () => {
	return await sanityClient.fetch(worksQuery);
});

export const getTagIndex = prerender(async () => {
	const [works, tags] = await Promise.all([getWorks(), getTags()]);
	const index = buildTagIndex(works);
	// Include unused tags with empty lists, and omit tags absent from the controls.
	return new Map(
		tags.flatMap((tag) => {
			const slug = tag.slug?.current;
			return slug ? [[slug, index.get(slug) ?? []] as const] : [];
		})
	);
});

export const getNewsWorkIds = prerender(async () => {
	return (await sanityClient.fetch(newsWorkIdsQuery)) ?? [];
});

export const getNewsEvents = prerender(async () => {
	return (await sanityClient.fetch(newsEventsQuery))?.filter((event) => event !== null) ?? [];
});

export const getInformation = prerender(async () => {
	const information = await sanityClient.fetch(informationQuery);
	if (!information) error(404, 'Information not found');
	return information;
});
