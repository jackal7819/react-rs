'use client';

import { ThemeProvider } from '@/context/ThemeProvider';

interface ThemeProviderWrapperProps {
	children: React.ReactNode;
}

export default function ThemeProviderWrapper({ children }: ThemeProviderWrapperProps) {
	return <ThemeProvider>{children}</ThemeProvider>;
}
