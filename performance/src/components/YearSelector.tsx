import { memo } from 'react';

interface YearSelectorProps {
	years: number[];
	selectedYear: number;
	onChange: (year: number) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ years, selectedYear, onChange }) => (
	<select
		name='year'
		id='year'
		aria-label='Select Year'
		value={selectedYear}
		onChange={(e) => onChange(parseInt(e.target.value))}
		className='p-2 text-white rounded bg-slate-700'
	>
		{years.map((year) => (
			<option key={year} value={year}>
				{year}
			</option>
		))}
	</select>
);

export default memo(YearSelector);
