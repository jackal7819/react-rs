import { memo } from 'react';

interface RegionFilterProps {
	regions: string[];
	selectedRegion: string;
	onChange: (region: string) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({ regions, selectedRegion, onChange }) => (
	<select
		name='region'
		id='region'
		aria-label='Select Region'
		value={selectedRegion}
		onChange={(e) => onChange(e.target.value)}
		className='p-2 text-white rounded bg-slate-700'
	>
		<option value=''>Select Region</option>
		{regions.map((region) => (
			<option key={region} value={region}>
				{region}
			</option>
		))}
	</select>
);

export default memo(RegionFilter);
