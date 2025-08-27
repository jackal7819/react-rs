import type { Country, YearData } from '../types';
import { use, useMemo, useState } from 'react';
import CountryTable from './CountryTable';
import YearSelector from './YearSelector';
import RegionFilter from './RegionFilter';
import SortControls from './SortControls';
import SearchBar from './SearchBar';

interface CountryListProps {
	countriesResource: Promise<Country[]>;
}

const CountryList: React.FC<CountryListProps> = ({ countriesResource }) => {
	const countries = use(countriesResource);

	const years = useMemo(() => {
		const setYears = new Set<number>();
		countries.forEach((c) => c.data.forEach((d) => d.year != null && setYears.add(d.year)));
		return Array.from(setYears).sort((a, b) => a - b);
	}, [countries]);

	const [selectedYear, setSelectedYear] = useState<number>(years[years.length - 1] ?? 0);
	const [selectedRegion, setSelectedRegion] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortBy, setSortBy] = useState<'name' | 'population'>('name');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const regions = useMemo(() => {
		const setRegions = new Set<string>();
		countries.forEach((c) => c.name && setRegions.add(c.name));
		return Array.from(setRegions).sort();
	}, [countries]);

	const filtered = useMemo(() => {
		return countries.filter((c) => {
			const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesRegion = !selectedRegion || c.name === selectedRegion;
			const matchesYear =
				!selectedYear || c.data.some((d: YearData) => d.year === selectedYear);
			return matchesSearch && matchesRegion && matchesYear;
		});
	}, [countries, searchQuery, selectedRegion, selectedYear]);

	const sorted = useMemo(() => {
		return [...filtered].sort((a, b) => {
			const getVal = (country: Country) =>
				sortBy === 'name'
					? country.name
					: country.data.find((d: YearData) => d.year === selectedYear)?.population ?? 0;

			const aVal = getVal(a);
			const bVal = getVal(b);

			if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
			if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
			return 0;
		});
	}, [filtered, sortBy, sortOrder, selectedYear]);

	const sortedFilteredData = useMemo(() => {
		return sorted.map((country) => ({
			...country,
			data: selectedYear ? country.data.filter((d) => d.year === selectedYear) : country.data,
		}));
	}, [sorted, selectedYear]);

	return (
		<div className='min-h-screen p-10 bg-slate-900 text-slate-400'>
			<div className='flex flex-wrap gap-4 mb-6'>
				<YearSelector
					years={years}
					selectedYear={selectedYear}
					onChange={setSelectedYear}
				/>
				<RegionFilter
					regions={regions}
					selectedRegion={selectedRegion}
					onChange={setSelectedRegion}
				/>
				<SearchBar query={searchQuery} onChange={setSearchQuery} />
				<SortControls
					sortBy={sortBy}
					sortOrder={sortOrder}
					onSortChange={(sb, so) => {
						setSortBy(sb);
						setSortOrder(so);
					}}
				/>
			</div>

			<div className='mb-6'>
				<CountryTable
					countries={sortedFilteredData}
					selectedYear={selectedYear}
					visibleColumns={[]}
				/>
			</div>
		</div>
	);
};

export default CountryList;
