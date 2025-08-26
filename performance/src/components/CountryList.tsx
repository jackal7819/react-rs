// import type { Country } from '../types';
// import { use } from 'react';
// import CountryCard from './CountryCard';

// interface CountryListProps {
// 	countriesResource: Promise<Country[]>;
// }

// const CountryList: React.FC<CountryListProps> = ({ countriesResource }) => {
// 	const countries = use(countriesResource);

// 	return (
// 		<div className='min-h-screen p-10 bg-slate-900 text-slate-400'>
// 			{countries.slice(0, 20).map((country) => (
// 				<CountryCard key={country.name} country={country} />
// 			))}
// 		</div>
// 	);
// };

// export default CountryList;

import type { Country } from '../types';
import { use, useMemo } from 'react';
import CountryCard from './CountryCard';
import CountryTable from './CountryTable';

interface CountryListProps {
	countriesResource: Promise<Country[]>;
}

const CountryList: React.FC<CountryListProps> = ({ countriesResource }) => {
	const countries = use(countriesResource);

	const countryList = useMemo(() => countries, [countries]);

	return (
		<div className='min-h-screen p-10 space-y-4 bg-slate-900 text-slate-400'>
			{countryList.map((country) => (
				<div key={country.iso_code ?? country.name}>
					<CountryCard country={country} />
					<CountryTable country={country} selectedYear={null} visibleColumns={[]} />
				</div>
			))}
		</div>
	);
};

export default CountryList;
