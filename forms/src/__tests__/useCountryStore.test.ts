import { act } from 'react';
import { useCountryStore } from '../store/useCountryStore';
import { describe, expect, it } from 'vitest';

describe('useCountryStore', () => {
	it('should initialize with the correct list of countries', () => {
		const { countries } = useCountryStore.getState();
		expect(countries.length).toBe(93);
		expect(countries[0]).toEqual({ code: 'AF', name: 'Afghanistan' });
		expect(countries[92]).toEqual({ code: 'YE', name: 'Yemen' });
	});

	it('should reset the countries list when initializeCountries is called', () => {
		act(() => {
			useCountryStore.setState({ countries: [{ code: 'UK', name: 'Ukraine' }] });
		});

		let { countries } = useCountryStore.getState();
		expect(countries.length).toBe(1);

		act(() => {
			useCountryStore.getState().initializeCountries();
		});

		({ countries } = useCountryStore.getState());
		expect(countries.length).toBe(93);
		expect(countries[0]).toEqual({ code: 'AF', name: 'Afghanistan' });
		expect(countries[92]).toEqual({ code: 'YE', name: 'Yemen' });
	});
});
