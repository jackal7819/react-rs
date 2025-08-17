import type { Metadata } from 'next';
import './../globals.css';

import { ReactNode } from 'react';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper';
import TanStackQueryProvider from '@/components/TanStackQueryProvider';
import { ThemeProvider } from '@/context/ThemeProvider'

export const metadata: Metadata = {
	title: 'Rick and Morty Explorer',
	description:
		'Browse and explore characters, episodes, and locations from the Rick and Morty universe.',
	keywords: ['Rick and Morty', 'Next.js', 'characters', 'episodes', 'locations', 'React', 'API'],
	authors: [{ name: 'Viktor Filippov', url: 'https://portfolio-next-roan.vercel.app' }],
};

export default async function LocaleLayout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider>
					<ErrorBoundaryWrapper>
						<TanStackQueryProvider>
							<ThemeProvider>
								<Navbar />
								<main>{children}</main>
							</ThemeProvider>
						</TanStackQueryProvider>
					</ErrorBoundaryWrapper>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
