'use client';

import { useSearchParams } from 'next/navigation';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useQueryUpdater } from '@/hooks/useQueryUpdater';
import { useCharactersQuery } from '@/hooks/useCharactersQuery';
import PaginationContainer from './PaginationContainer';
import DetailPanel from './DetailPanel';
import SearchBar from './SearchBar';
import CardList from './CardList';
import Flyout from './Flyout';
import Loader from './Loader';

export default function HomeInner() {
	const searchParams = useSearchParams();
	const updateQuery = useQueryUpdater();

	const [term, setTerm] = useLocalStorage('searchTerm', '');

	const pageRaw = searchParams.get('page');
	const page = Number.isFinite(Number(pageRaw)) && Number(pageRaw) > 0 ? Number(pageRaw) : 1;

	const detailsId = searchParams.get('details') ?? null;

	const { data, isPending, isError, error } = useCharactersQuery(term, page);

	const handleCardClick = (id: number) => {
		updateQuery({ page: String(page), details: String(id) }, { method: 'push', scroll: false });
	};

	const handleBackgroundClick = () => {
		if (detailsId) updateQuery({ details: undefined }, { method: 'replace', scroll: false });
	};

	return (
		<main
			className='min-h-screen antialiased bg-slate-200 text-slate-700 dark:bg-slate-900 dark:text-slate-400'
			onClick={handleBackgroundClick}
		>
			<div className='flex gap-4 p-4 mx-auto max-w-7xl'>
				<div className='w-full'>
					<SearchBar
						onSearch={(newTerm) => {
							setTerm(newTerm);
							updateQuery(
								{ page: '1', details: undefined },
								{ method: 'replace', scroll: false }
							);
						}}
					/>

					{isPending ? (
						<div className='flex h-[50vh] w-full items-center justify-center'>
							<Loader />
						</div>
					) : isError ? (
						<div className='py-4 text-rose-500'>
							{(error as Error)?.message ?? 'Something went wrong'}
						</div>
					) : (
						<>
							<CardList data={data?.results ?? []} onCardClick={handleCardClick} />
							<Flyout />
							<PaginationContainer
								currentPage={page}
								pageCount={data?.info.pages ?? 1}
								onPageChange={(newPage) => {
									updateQuery(
										{ page: String(newPage) },
										{ method: 'replace', scroll: false }
									);
								}}
							/>
						</>
					)}
				</div>

				{detailsId && (
					<div
						className='w-1/2 pl-4 border-l border-slate-700'
						onClick={(e) => e.stopPropagation()}
					>
						<DetailPanel />
					</div>
				)}
			</div>
		</main>
	);
}
