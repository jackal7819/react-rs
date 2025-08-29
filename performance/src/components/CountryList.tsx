import type { Country, YearData } from '../types';
import { EXTRA_COLUMNS_TOP5 } from '../constants';
import { use, useMemo, useState, useCallback } from 'react';
import CountriesTable from './CountriesTable';
import YearSelector from './YearSelector';
import RegionFilter from './RegionFilter';
import SortControls from './SortControls';
import ColumnsModal from './ColumnsModal';
import SearchBar from './SearchBar';

interface CountryListProps {
	countriesResource: Promise<Country[]>;
}

const CountryList: React.FC<CountryListProps> = ({ countriesResource }) => {
	const countries = use(countriesResource);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
	const [selectedYear, setSelectedYear] = useState<number>(0);
	const [selectedRegion, setSelectedRegion] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [sortBy, setSortBy] = useState<'name' | 'population'>('name');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

	const years = useMemo(() => {
		const setYears = new Set<number>();
		countries.forEach((c) => c.data.forEach((d) => d.year != null && setYears.add(d.year)));
		return Array.from(setYears).sort((a, b) => a - b);
	}, [countries]);

	useMemo(() => {
		if (years.length > 0 && !selectedYear) {
			setSelectedYear(years[years.length - 1]);
		}
	}, [years, selectedYear]);

	const regions = useMemo(() => {
		const setRegions = new Set<string>();
		countries.forEach((c) => c.name && setRegions.add(c.name));
		return Array.from(setRegions).sort();
	}, [countries]);

	const handleYearChange = useCallback((year: number) => {
		setSelectedYear(year);
	}, []);

	const handleRegionChange = useCallback((region: string) => {
		setSelectedRegion(region);
	}, []);

	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
	}, []);

	const handleSortChange = useCallback((sb: 'name' | 'population', so: 'asc' | 'desc') => {
		setSortBy(sb);
		setSortOrder(so);
	}, []);

	const handleOpenModal = useCallback(() => {
		setIsModalOpen(true);
	}, []);

	const handleCloseModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	const handleApplyColumns = useCallback((cols: string[]) => {
		setSelectedColumns(cols);
	}, []);

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
					onChange={handleYearChange}
				/>
				<RegionFilter
					regions={regions}
					selectedRegion={selectedRegion}
					onChange={handleRegionChange}
				/>
				<SearchBar query={searchQuery} onChange={handleSearchChange} />
				<SortControls
					sortBy={sortBy}
					sortOrder={sortOrder}
					onSortChange={handleSortChange}
				/>
				<button
					type='button'
					className='px-3 py-2 text-white duration-500 rounded cursor-pointer bg-slate-700 hover:bg-slate-600'
					onClick={handleOpenModal}
				>
					Extra Columns ⚙️
				</button>
			</div>

			<div className='mb-6'>
				<CountriesTable
					countries={sortedFilteredData}
					selectedYear={selectedYear}
					visibleColumns={selectedColumns}
				/>
				<ColumnsModal
					isOpen={isModalOpen}
					availableColumns={EXTRA_COLUMNS_TOP5}
					selectedColumns={selectedColumns}
					onClose={handleCloseModal}
					onApply={handleApplyColumns}
				/>
			</div>
		</div>
	);
};

export default CountryList;
