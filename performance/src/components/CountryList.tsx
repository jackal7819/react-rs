import type { Country } from '../types';
import { use } from 'react';
import CountryCard from './CountryCard';

interface CountryListProps {
	countriesResource: Promise<Country[]>;
}

const CountryList = ({ countriesResource }: CountryListProps) => {
	const countries = use(countriesResource);

	return (
		<div className='min-h-screen p-10 bg-slate-900 text-slate-400'>
			{countries.slice(0, 20).map((country) => (
				<CountryCard key={country.name} country={country} />
			))}
		</div>
	);
};

export default CountryList;
