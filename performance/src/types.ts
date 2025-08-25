export interface YearData {
	year: number;
	population?: number;
	co2?: number;
	co2_per_capita?: number;
	[key: string]: number | string | undefined;
}

export interface Country {
	country: string;
	iso_code?: string;
	data: YearData[];
}
