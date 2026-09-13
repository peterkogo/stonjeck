import { error } from '@sveltejs/kit';
import { defineQuery } from 'groq';
import { prerender } from '$app/server';

import { sanityClient } from '$lib/sanity/client';

const seriesListQuery = defineQuery(`
	*[_type == "series"] | order(order desc) {
		_id,
		slug,
		title,
		order
	}
`);

const seriesBySlugQuery = defineQuery(`
	*[_type == "series" && slug.current == $slug][0] {
		_id,
		slug,
		title,
		order,
		works[]-> | order(date desc) {
			_id,
			slug,
			title,
			image {
				hotspot,
				crop,
				asset->{
					_id,
					metadata {
						blurHash,
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
			medium-> {
				name
			}
		}
	}
`);

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
					blurHash,
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
		"series": *[_type == "series" && references(^._id)] {
			slug
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
				metadata { blurHash, dimensions { width, height, aspectRatio } }
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
						blurHash,
						dimensions
					}
				}
			}
		},
		biography,
		impressum
	}
`);

const seriesSlugsQuery = defineQuery(`
	*[_type == "series" && defined(slug.current)].slug.current
`);

export const getSeriesList = prerender(async () => {
	return await sanityClient.fetch(seriesListQuery);
});

export const getSeries = prerender(
	'unchecked',
	async (slug: string) => {
		const series = await sanityClient.fetch(seriesBySlugQuery, { slug });
		if (!series) error(404, 'Series not found');
		return series;
	},
	{
		inputs: async () => {
			const slugs = await sanityClient.fetch(seriesSlugsQuery);
			return slugs.filter((slug): slug is string => slug !== null);
		}
	}
);

export const getWorks = prerender(async () => {
	return await sanityClient.fetch(worksQuery);
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
