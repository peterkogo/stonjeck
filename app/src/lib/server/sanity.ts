import { SANITY_API_READ_TOKEN } from '$env/static/private';
import { createServerClient } from '$lib/sanity/client';
import {
	allWorksQuery,
	workByIdQuery,
	allSeriesQuery,
	seriesByIdQuery,
	allMediumQuery,
	allContentIdsQuery
} from '$lib/sanity/queries';
import type { Work, Series, Medium } from '$lib/sanity/types';

// Create server client with read token
const serverClient = createServerClient(SANITY_API_READ_TOKEN);

export async function getAllWorks(): Promise<Work[]> {
	try {
		return await serverClient.fetch(allWorksQuery);
	} catch (error) {
		console.error('Error fetching works:', error);
		return [];
	}
}

export async function getWorkById(id: string): Promise<Work | null> {
	try {
		return await serverClient.fetch(workByIdQuery, { id });
	} catch (error) {
		console.error('Error fetching work:', error);
		return null;
	}
}

export async function getAllSeries(): Promise<Series[]> {
	try {
		return await serverClient.fetch(allSeriesQuery);
	} catch (error) {
		console.error('Error fetching series:', error);
		return [];
	}
}

export async function getSeriesById(id: string): Promise<Series | null> {
	try {
		return await serverClient.fetch(seriesByIdQuery, { id });
	} catch (error) {
		console.error('Error fetching series:', error);
		return null;
	}
}

export async function getAllMedium(): Promise<Medium[]> {
	try {
		return await serverClient.fetch(allMediumQuery);
	} catch (error) {
		console.error('Error fetching medium:', error);
		return [];
	}
}

export async function getAllContentIds(): Promise<{ works: string[]; series: string[] }> {
	try {
		return await serverClient.fetch(allContentIdsQuery);
	} catch (error) {
		console.error('Error fetching content IDs:', error);
		return { works: [], series: [] };
	}
}
