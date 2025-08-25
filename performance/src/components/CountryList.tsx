import type { Country } from '../types';
import CountryCard from './CountryCard';

type CountryListProps = {
	countries: Country[];
};

const CountryList = ({ countries }: CountryListProps) => {
	return (
		<div className='p-4'>
			{countries.slice(0, 20).map((country) => (
				<CountryCard key={country.country} country={country} />
			))}
		</div>
	);
};

export default CountryList;
