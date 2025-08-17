import { useTranslations } from 'next-intl';

interface PaginationContainerProps {
	currentPage: number;
	pageCount: number;
	onPageChange: (page: number) => void;
}

export default function PaginationContainer({
	currentPage,
	pageCount,
	onPageChange,
}: PaginationContainerProps) {
	const t = useTranslations('PaginationContainer');

	const generatePages = () => {
		const pages: (number | string)[] = [];

		if (pageCount <= 7) {
			for (let i = 1; i <= pageCount; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			if (currentPage > 4) {
				pages.push('...');
			}

			const start = Math.max(2, currentPage - 1);
			const end = Math.min(pageCount - 1, currentPage + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (currentPage < pageCount - 3) {
				pages.push('...');
			}

			pages.push(pageCount);
		}

		return pages;
	};

	const pages = generatePages();

	return (
		<div
			className='flex items-center justify-center mt-4 mb-8 text-lg'
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			<div className='flex flex-wrap gap-1'>
				{pages.length > 0 && (
					<button
						type='button'
						className='p-2 px-4 duration-500 rounded-lg cursor-pointer disabled:opacity-50 hover:bg-amber-600 hover:text-black disabled:hover:bg-transparent disabled:hover:cursor-default disabled:hover:text-slate-400'
						disabled={currentPage === 1}
						onClick={() => onPageChange(currentPage - 1)}
					>
						{t('prev')}
					</button>
				)}
				{pages.map((page, index) =>
					typeof page === 'number' ? (
						<button
							type='button'
							key={index}
							onClick={() => onPageChange(page)}
							className={`p-2 px-4 rounded-lg hover:bg-amber-600 duration-500 hover:text-black ${
								page === currentPage
									? 'bg-amber-600 text-black cursor-default'
									: 'cursor-pointer'
							}`}
						>
							{page}
						</button>
					) : (
						<span key={index} className='p-2 px-4'>
							...
						</span>
					)
				)}
				{pages.length > 0 && (
					<button
						type='button'
						className='p-2 px-4 duration-500 rounded-lg cursor-pointer disabled:opacity-50 hover:bg-amber-600 hover:text-black disabled:hover:bg-transparent disabled:hover:cursor-default disabled:hover:text-slate-400'
						disabled={currentPage === pageCount}
						onClick={() => onPageChange(currentPage + 1)}
					>
						{t('next')}
					</button>
				)}
			</div>
		</div>
	);
}
