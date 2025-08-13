'use client';

import { useEffect, useState, ReactNode } from 'react';
import { Theme, ThemeContext } from './ThemeContext';

interface ThemeProviderProps {
	children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
	const [theme, setTheme] = useState<Theme>('light');
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const storedTheme = localStorage.getItem('theme') as Theme;
		setTheme(storedTheme || 'light');

		const root = window.document.documentElement;
		root.classList.toggle('dark', storedTheme === 'dark');

		setMounted(true);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === 'dark' ? 'light' : 'dark';
		setTheme(newTheme);
		localStorage.setItem('theme', newTheme);

		const root = window.document.documentElement;
		root.classList.toggle('dark', newTheme === 'dark');
	};

	if (!mounted) return null;

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
