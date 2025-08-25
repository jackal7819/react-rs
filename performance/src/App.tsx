import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fetchCountriesData } from './hooks/useCountriesData';
import ErrorFallback from './components/ErrorFallback';
import CountryList from './components/CountryList';
import Loader from './components/Loader';

const countriesResource = fetchCountriesData();

export const App: React.FC = () => (
	<ErrorBoundary FallbackComponent={ErrorFallback}>
		<Suspense fallback={<Loader />}>
			<CountryList countriesResource={countriesResource} />
		</Suspense>
	</ErrorBoundary>
);

export default App;
