import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'rickandmortyapi.com',
				pathname: '/api/character/avatar/**',
			},
		],
	},
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
