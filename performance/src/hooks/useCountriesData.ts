import type { Country } from '../types';

export async function fetchCountriesData(): Promise<Country[]> {
	const response = await fetch('/co2-data.json');
	const json = await response.json();

	return Object.values(json) as Country[];
}
