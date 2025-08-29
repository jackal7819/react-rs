import { memo } from 'react';

interface SortControlsProps {
	sortBy: 'name' | 'population';
	sortOrder: 'asc' | 'desc';
	onSortChange: (sortBy: 'name' | 'population', sortOrder: 'asc' | 'desc') => void;
}

const SortControls: React.FC<SortControlsProps> = ({ sortBy, sortOrder, onSortChange }) => (
	<div className='flex items-center gap-4'>
		<label>Sort by:</label>
		<select
			name='sortBy'
			id='sortBy'
			aria-label='Select Sort By'
			value={sortBy}
			onChange={(e) => onSortChange(e.target.value as 'name' | 'population', sortOrder)}
			className='p-2 text-white rounded bg-slate-700'
		>
			<option value='name'>Name</option>
			<option value='population'>Population</option>
		</select>
		<select
			name='sortOrder'
			id='sortOrder'
			aria-label='Select Sort Order'
			value={sortOrder}
			onChange={(e) => onSortChange(sortBy, e.target.value as 'asc' | 'desc')}
			className='p-2 text-white rounded bg-slate-700'
		>
			<option value='asc'>Ascending</option>
			<option value='desc'>Descending</option>
		</select>
	</div>
);

export default memo(SortControls);
