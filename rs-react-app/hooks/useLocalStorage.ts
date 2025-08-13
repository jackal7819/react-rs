import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
	const [value, setValue] = useState<T>(() => {
		try {
			const stored = localStorage.getItem(key);
			return stored ? JSON.parse(stored) : initialValue;
		} catch (e) {
			console.warn(`useLocalStorage: Failed to read key "${key}" from localStorage`, e);
			return initialValue;
		}
	});

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (e) {
			console.warn(`useLocalStorage: Failed to write key "${key}" to localStorage`, e);
		}
	}, [key, value]);

	return [value, setValue];
}
