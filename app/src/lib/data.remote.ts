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
		works[]-> {
			_id,
			slug,
			title,
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
			medium-> {
				_id,
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
		tags[]-> {
			_id,
			name
		},
		medium-> {
			_id,
			name
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

export const getInformation = prerender(async () => {
	const information = await sanityClient.fetch(informationQuery);
	if (!information) error(404, 'Information not found');
	return information;
});
