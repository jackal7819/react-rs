import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const router = useRouter();

	const switchLocale = useCallback(
		(newLocale: string) => {
			const segments = pathname.split('/');
			if (segments[1] === locale) segments[1] = newLocale;
			const newPath = segments.join('/');

			const params = Object.fromEntries(searchParams.entries());
			const search = new URLSearchParams(params).toString();

			router.push(newPath + (search ? '?' + search : ''));
		},
		[pathname, searchParams, locale, router]
	);

	return (
		<div>
			<label htmlFor='language' className='sr-only'>
				Language
			</label>
			<select
				id='language'
				value={locale}
				onChange={(e) => switchLocale(e.target.value)}
				className='flex items-center px-2 py-1.5 text-xl text-center text-black duration-500 bg-white rounded-lg cursor-pointer hover:text-amber-600 font-semibold'
			>
				<option value='en'>EN</option>
				<option value='de'>DE</option>
			</select>
		</div>
	);
}
