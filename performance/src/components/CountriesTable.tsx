import type { Country } from '../types';
import { DEFAULT_COLUMNS } from '../constants';
import { memo, useMemo, useState, useEffect } from 'react';

interface CountriesTableProps {
	countries: Country[];
	selectedYear: number | null;
	visibleColumns?: string[];
}

const CountriesTable: React.FC<CountriesTableProps> = ({
	countries,
	selectedYear,
	visibleColumns = [],
}) => {
	const columns = useMemo(() => {
		const set = new Set<string>([...DEFAULT_COLUMNS, ...visibleColumns]);
		const extras = Array.from(set)
			.filter((c) => !DEFAULT_COLUMNS.includes(c))
			.sort();
		return [...DEFAULT_COLUMNS.filter((c) => set.has(c)), ...extras];
	}, [visibleColumns]);

	const [highlightYear, setHighlightYear] = useState<number | null>(null);

	useEffect(() => {
		if (selectedYear == null) return;
		setHighlightYear(selectedYear);
		const id = window.setTimeout(() => setHighlightYear(null), 900);
		return () => window.clearTimeout(id);
	}, [selectedYear]);

	const rowsJSX = useMemo(() => {
		return countries.flatMap((country) =>
			country.data.map((r) => {
				const key = `${country.iso_code ?? country.name}-${r.year}`;
				const isHighlighted = highlightYear === r.year;

				return (
					<tr
						key={key}
						className={`align-top ${
							isHighlighted ? 'animate-pulse bg-yellow-300/20' : ''
						}`}
					>
						{columns.map((col) => {
							let raw: string | number | null | undefined;

							switch (col) {
								case 'name':
									raw = country.name;
									break;
								case 'iso_code':
									raw = country.iso_code;
									break;
								default:
									raw = r[col];
							}

							const display =
								raw === null || raw === undefined
									? 'N/A'
									: typeof raw === 'number'
									? raw.toLocaleString(undefined, { useGrouping: false })
									: String(raw);

							return (
								<td
									key={`${key}-${col}`}
									className='px-3 py-2 text-sm border-t border-r border-slate-600'
								>
									{display}
								</td>
							);
						})}
					</tr>
				);
			})
		);
	}, [countries, columns, highlightYear]);

	return (
		<div className='mt-3'>
			<div className='overflow-x-auto border rounded border-slate-600'>
				<table className='min-w-full text-center border-collapse'>
					<thead>
						<tr>
							{columns.map((col) => (
								<th
									key={col}
									className='px-3 py-2 text-xs font-medium tracking-wide uppercase border-r text-slate-400 border-slate-600 last:border-r-0'
								>
									{col.replaceAll('_', ' ')}
								</th>
							))}
						</tr>
					</thead>
					<tbody>{rowsJSX}</tbody>
				</table>
			</div>
		</div>
	);
};

export default memo(CountriesTable);
