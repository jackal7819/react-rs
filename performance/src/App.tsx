import { Suspense } from 'react';
import { fetchCountriesData } from './hooks/useCountriesData';
import CountryList from './components/CountryList';
import Loader from './components/Loader';

const countriesResource = fetchCountriesData();

export const App = () => (
	<Suspense fallback={<Loader />}>
		<CountryList countriesResource={countriesResource} />
	</Suspense>
);

export default App;
