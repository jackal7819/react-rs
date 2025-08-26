interface YearSelectorProps {
	years: number[];
	selectedYear: number | null;
	onChange: (year: number | null) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ years, selectedYear, onChange }) => (
	<select
		name='year'
		id='year'
		aria-label='Select Year'
		value={selectedYear ?? ''}
		onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : null)}
		className='p-2 text-white rounded bg-slate-700'
	>
		<option value=''>Select Year</option>
		{years.map((year) => (
			<option key={year} value={year}>
				{year}
			</option>
		))}
	</select>
);

export default YearSelector;
