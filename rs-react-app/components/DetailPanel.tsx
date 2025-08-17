import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useCharacterQuery } from '@/hooks/useCharacterQuery';
import Image from 'next/image';
import Loader from './Loader';
import { useTranslations } from 'next-intl';

export default function DetailPanel() {
	const t = useTranslations('DetailPanel');
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const idParam = searchParams.get('details');
	const id = idParam ? Number(idParam) : null;

	const {
		data: character,
		isPending,
		isError,
		error,
	} = useCharacterQuery(id ? Number(id) : null);

	const handleClose = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete('details');

		const next = params.toString();
		router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
	};

	if (isPending) return <Loader />;
	if (isError) return <div className='text-rose-500'>{error.message}</div>;
	if (!character) return null;

	return (
		<div className='relative p-4 rounded-lg dark:bg-slate-800 bg-slate-300'>
			<button
				type='button'
				className='absolute text-2xl duration-500 cursor-pointer top-4 right-4 text-slate-400 hover:text-white'
				onClick={handleClose}
				aria-label='Close details'
			>
				✖
			</button>

			<h2 className='mb-2 text-2xl font-bold'>{character.name}</h2>

			<Image
				width='365'
				height='200'
				src={character.image}
				alt={character.name}
				priority
				className='mb-4 rounded-lg'
			/>

			<ul className='space-y-1 text-lg'>
				<li>
					<strong>{t('status')}:</strong> {character.status}
				</li>
				<li>
					<strong>{t('species')}:</strong> {character.species}
				</li>
				{character.type && (
					<li>
						<strong>{t('type')}:</strong> {character.type}
					</li>
				)}
				<li>
					<strong>{t('gender')}:</strong> {character.gender}
				</li>
				<li>
					<strong>{t('origin')}:</strong> {character.origin?.name}
				</li>
				<li>
					<strong>{t('location')}:</strong> {character.location?.name}
				</li>
				<li>
					<strong>{t('episodes')}:</strong> {character.episode?.length ?? 0}
				</li>
			</ul>
		</div>
	);
}
