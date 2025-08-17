import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
	const [storedValue, setStoredValue] = useState<T>(() => {
		if (typeof window === 'undefined') {
			return initialValue;
		}

		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.warn(`useLocalStorage: Failed to read key "${key}" from localStorage`, error);
			return initialValue;
		}
	});

	const setValue = useCallback(
		(value: T) => {
			try {
				setStoredValue(value);

				if (typeof window !== 'undefined') {
					window.localStorage.setItem(key, JSON.stringify(value));
				}
			} catch (error) {
				console.warn(`useLocalStorage: Failed to set key "${key}" in localStorage`, error);
			}
		},
		[key]
	);

	return [storedValue, setValue];
}
