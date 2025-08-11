import type { Metadata } from 'next';
import './globals.css';

import { ReactNode } from 'react';
import ThemeProviderWrapper from '@/components/ThemeProviderWrapper';
import Navbar from '@/components/Navbar';
import ErrorBoundaryWrapper from '@/components/ErrorBoundaryWrapper'
import TanStackQueryProvider from '@/components/TanStackQueryProvider'

export const metadata: Metadata = {
  title: "Rick and Morty Explorer",
  description: "Browse and explore characters, episodes, and locations from the Rick and Morty universe.",
  keywords: [
    "Rick and Morty",
    "Next.js",
    "characters",
    "episodes",
    "locations",
    "React",
    "API"
  ],
  authors: [
    { name: "Viktor Filippov", url: "https://portfolio-next-roan.vercel.app" }
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang='en'>
			<body>
				<ErrorBoundaryWrapper>
					<TanStackQueryProvider>
						<ThemeProviderWrapper>
							<Navbar />
							<main>{children}</main>
						</ThemeProviderWrapper>
					</TanStackQueryProvider>
				</ErrorBoundaryWrapper>
			</body>
		</html>
	);
}
