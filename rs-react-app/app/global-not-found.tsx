import type { Metadata } from 'next';
import './globals.css';

import Link from 'next/link';

export const metadata: Metadata = {
	title: '404 - Page Not Found',
	description: 'Sorry, we could not find the page you are looking for...',
};

export default function GlobalNotFound() {
	return (
		<html lang='en'>
			<body>
				<main className='grid min-h-screen px-8 antialiased bg-slate-200 dark:text-slate-400 dark:bg-slate-900 text-slate-700 place-items-center'>
					<div className='text-center'>
						<p className='font-semibold text-9xl'>404</p>
						<h1 className='mt-4 text-3xl font-bold tracking-tight capitalize sm:text-5xl'>
							page not found
						</h1>
						<p className='mt-6 text-lg leading-7'>
							Sorry, we could not find the page you are looking for...
						</p>
						<div className='mt-14'>
							<Link
								href='/en'
								className='bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer uppercase'
							>
								go back home
							</Link>
						</div>
					</div>
				</main>
			</body>
		</html>
	);
}
