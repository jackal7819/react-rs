'use client';

import { CsvItem } from '@/types';

import { compileCsv } from '@/app/actions/exportCsv';
import { useSelectedItemsStore } from '@/store/selectedItemsStore';

export default function Flyout() {
	const { selectedItems, unselectAll } = useSelectedItemsStore();

	if (selectedItems.length === 0) return null;

	const handleDownload = async () => {
		const { filename, csv } = await compileCsv(selectedItems as CsvItem[]);
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className='sticky bottom-0 flex flex-wrap items-center gap-4 px-4 py-2 rounded-lg bg-amber-100'>
			<p className='uppercase'>{selectedItems.length} items are selected</p>
			<button
				type='button'
				onClick={unselectAll}
				className='bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer'
			>
				Unselect all
			</button>
			<button
				type='button'
				onClick={handleDownload}
				className='bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer'
			>
				Download
			</button>
		</div>
	);
}
