'use client';

import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';

export default function Navbar () {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className='bg-slate-400'>
			<nav className='flex items-center justify-between p-4 mx-auto max-w-7xl h-14'>
				<div className='flex gap-5'>
					<Link
						href='/'
						className="text-black text-2xl font-semibold duration-500 cursor-pointer hover:brightness-110 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-black after:duration-500 hover:after:w-full"
					>
						Home
					</Link>
					<Link
						href='/about'
						className="text-black text-2xl font-semibold duration-500 cursor-pointer hover:brightness-110 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-black after:duration-500 hover:after:w-full"
					>
						About
					</Link>
				</div>
				<div className='flex items-center gap-4'>
					<button
						type='button'
						onClick={toggleTheme}
						className='inline-flex items-center px-2 py-1.5 text-xl text-center text-black duration-500 bg-white rounded-lg cursor-pointer hover:text-amber-600 font-semibold'
					>
						{theme === 'light' ? 'Dark' : 'Light'} Mode
					</button>
					<a
						href='https://rs.school/'
						target='_blank'
						rel='noopener noreferrer'
						className='flex items-center justify-center p-1 text-xl font-semibold duration-500 bg-black rounded-md group hover:bg-amber-600'
					>
						<span className='ml-1 mr-2 text-white duration-500 group-hover:text-white'>
							RS
						</span>
						<span className='flex items-center justify-center w-20 h-8 text-black duration-500 bg-white rounded group-hover:text-amber-600'>
							School
						</span>
					</a>
				</div>
			</nav>
		</div>
	);
};
