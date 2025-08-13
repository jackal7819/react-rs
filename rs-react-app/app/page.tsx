// 'use client';

// import { useLocalStorage } from '@/hooks/useLocalStorage';
// import { useCharactersQuery } from '@/hooks/useCharactersQuery';
// import PaginationContainer from '@/components/PaginationContainer';
// import SearchBar from '@/components/SearchBar';
// import CardList from '@/components/CardList';
// import Flyout from '@/components/Flyout';
// import Loader from '@/components/Loader';

// export default function Home() {
// 	const [searchParams, setSearchParams] = useSearchParams();
// 	const [term, setTerm] = useLocalStorage('searchTerm', '');
// 	const page = parseInt(searchParams.get('page') || '1', 10);
// 	const detailsId = searchParams.get('details');

// 	const { data, isPending, isError, error } = useCharactersQuery(term, page);

// 	const handleCardClick = (id: number) => {
// 		setSearchParams({ page: String(page), details: String(id) });
// 	};

// 	return (
// 		<main
// 			className='min-h-screen antialiased bg-slate-200 dark:text-slate-400 dark:bg-slate-900 text-slate-700'
// 			onClick={() => {
// 				if (detailsId) {
// 					setSearchParams({ page: String(page) });
// 				}
// 			}}
// 		>
// 			<div className='flex gap-4 p-4 mx-auto max-w-7xl'>
// 				<div className='w-full'>
// 					<SearchBar
// 						onSearch={(newTerm) => {
// 							setTerm(newTerm);
// 							setSearchParams({ page: '1' });
// 						}}
// 					/>
// 					{isPending ? (
// 						<div className='flex items-center justify-center w-full h-[50vh]'>
// 							<Loader />
// 						</div>
// 					) : isError ? (
// 						<div className='py-4 text-rose-500'>{error.message}</div>
// 					) : (
// 						<>
// 							<CardList data={data?.results || []} onCardClick={handleCardClick} />
// 							<Flyout />
// 							<PaginationContainer
// 								currentPage={page}
// 								pageCount={data?.info.pages || 1}
// 								onPageChange={(newPage) =>
// 									setSearchParams({ page: String(newPage) })
// 								}
// 							/>
// 						</>
// 					)}
// 				</div>

// 				{detailsId && (
// 					<div
// 						className='w-1/2 pl-4 border-l border-slate-700'
// 						onClick={(e) => e.stopPropagation()}
// 					>
// 						<Outlet />
// 					</div>
// 				)}
// 			</div>
// 		</main>
// 	);
// }

'use client';

import { Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useCharactersQuery } from '@/hooks/useCharactersQuery';

import PaginationContainer from '@/components/PaginationContainer';
import DetailPanel from '@/components/DetailPanel';
import SearchBar from '@/components/SearchBar';
import CardList from '@/components/CardList';
import Flyout from '@/components/Flyout';
import Loader from '@/components/Loader';

function useQueryUpdater() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const update = (
		patch: Record<string, string | undefined>,
		opts: { method?: 'push' | 'replace'; scroll?: boolean } = {}
	) => {
		const method = opts.method ?? 'replace';
		const sp = new URLSearchParams(searchParams.toString());

		for (const [key, val] of Object.entries(patch)) {
			if (val === undefined || val === null || val === '') sp.delete(key);
			else sp.set(key, val);
		}

		const qs = sp.toString();
		const href = qs ? `${pathname}?${qs}` : pathname;

		if (method === 'push') router.push(href, { scroll: opts.scroll ?? false });
		else router.replace(href, { scroll: opts.scroll ?? false });
	};

	return update;
}

function HomeInner() {
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

export default function Home() {
	return (
		<Suspense
			fallback={
				<div className='flex items-center justify-center w-full h-screen'>
					<Loader />
				</div>
			}
		>
			<HomeInner />
		</Suspense>
	);
}
