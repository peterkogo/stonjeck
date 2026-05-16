import { error } from '@sveltejs/kit';
import { defineQuery } from 'groq';

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
			name,
			slug
		},
		"series": *[_type == "series" && references(^._id)] {
			_id,
			slug,
			title
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

export async function getSeriesList() {
	return await sanityClient.fetch(seriesListQuery);
}

export async function getSeries(slug: string) {
	const series = await sanityClient.fetch(seriesBySlugQuery, { slug });
	if (!series) error(404, 'Series not found');
	return series;
}

export async function getWorks() {
	return await sanityClient.fetch(worksQuery);
}

export async function getInformation() {
	const information = await sanityClient.fetch(informationQuery);
	if (!information) error(404, 'Information not found');
	return information;
}
