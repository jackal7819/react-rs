import type { Country } from '../types';

interface CountryCardProps {
	country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
	const latestYear = country.data[country.data.length - 1];
	const population = latestYear?.population ?? 'N/A';

	return (
		<div className='p-3 mb-4 border rounded shadow'>
			<h2 className='text-lg font-bold'>
				{country.name} {country.iso_code ? `(${country.iso_code})` : ''}
			</h2>
			<p>Population (latest): {population}</p>
		</div>
	);
};

export default CountryCard;
