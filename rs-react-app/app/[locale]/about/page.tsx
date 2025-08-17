import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
	const t = useTranslations('About');

	return (
		<div className='grid px-8 antialiased min-h-page md:pb-20 bg-slate-200 dark:text-slate-400 dark:bg-slate-900 text-slate-700 place-items-center'>
			<div className='max-w-4xl p-4 mx-auto'>
				<h1 className='mb-6 text-4xl font-bold text-center'>{t('about')}</h1>
				<p className='mb-4 text-lg'>{t('hello')}
				</p>
				<p className='mb-4 text-lg'>{t('this')}
				</p>
				<p className='mb-6 text-lg'>
					{t('to')}{' '}
					<a
						href='https://rs.school/courses/reactjs'
						target='_blank'
						rel='noopener noreferrer'
						className="text-amber-600 font-semibold duration-500 cursor-pointer hover:brightness-110 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-amber-600 after:duration-500 hover:after:w-full"
					>
						{t('school')}
					</a>
					.
				</p>
				<nav className='text-center'>
					<Link
						href='/'
						className='bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer uppercase'
					>
						{t('back')}
					</Link>
				</nav>
			</div>
		</div>
	);
}
