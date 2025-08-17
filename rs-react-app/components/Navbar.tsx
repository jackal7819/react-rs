'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTheme } from '@/hooks/useTheme';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
	const { theme, toggleTheme } = useTheme();
	const t = useTranslations('Navbar');

	return (
		<div className='bg-slate-400'>
			<nav className='flex items-center justify-between p-4 mx-auto max-w-7xl h-14'>
				<div className='flex gap-5'>
					<Link
						href='/'
						className="text-black text-2xl font-semibold duration-500 cursor-pointer hover:brightness-110 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-black after:duration-500 hover:after:w-full"
					>
						{t('home')}
					</Link>
					<Link
						href='/about'
						className="text-black text-2xl font-semibold duration-500 cursor-pointer hover:brightness-110 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-black after:duration-500 hover:after:w-full"
					>
						{t('about')}
					</Link>
				</div>
				<div className='flex items-center gap-4'>
					<button
						type='button'
						onClick={toggleTheme}
						className='inline-flex items-center px-2 py-1.5 text-xl text-center text-black duration-500 bg-white rounded-lg cursor-pointer hover:text-amber-600 font-semibold'
					>
						{theme === 'light' ? t('dark') : t('light')}
					</button>
					<LanguageSwitcher />
				</div>
			</nav>
		</div>
	);
}
