import type { Country, YearData } from '../types';

interface RawCountryData {
  iso_code?: string;
  data: YearData[];
}

interface RawData {
	[name: string]: RawCountryData;
}

export async function fetchCountriesData(): Promise<Country[]> {
	const response = await fetch('/co2-data.json');
	const json = await response.json() as RawData;

	return Object.entries(json).map(([name, { iso_code, data }]) => ({
		name,
		iso_code,
		data,
	}));
}
