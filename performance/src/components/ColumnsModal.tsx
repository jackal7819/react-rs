import { useState } from 'react';

interface ColumnsModalProps {
	isOpen: boolean;
	availableColumns: string[];
	selectedColumns: string[];
	onClose: () => void;
	onApply: (columns: string[]) => void;
}

const ColumnsModal: React.FC<ColumnsModalProps> = ({
	isOpen,
	availableColumns,
	selectedColumns,
	onClose,
	onApply,
}) => {
	const [localSelection, setLocalSelection] = useState<string[]>(selectedColumns);

	if (!isOpen) return null;

	const toggleColumn = (col: string) => {
		setLocalSelection((prev) =>
			prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
		);
	};

	const selectAll = () => setLocalSelection([...availableColumns]);
	const deselectAll = () => setLocalSelection([]);

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'>
			<div className='bg-slate-800 text-white rounded p-6 w-80 max-h-[80vh] overflow-y-auto'>
				<h2 className='mb-4 text-lg font-bold'>Select Columns</h2>
				<div className='flex flex-col gap-2 mb-4'>
					{availableColumns.map((col) => (
						<label key={col} className='flex items-center gap-2'>
							<input
								type='checkbox'
								checked={localSelection.includes(col)}
								onChange={() => toggleColumn(col)}
								className='accent-sky-400'
							/>
							{col.replaceAll('_', ' ')}
						</label>
					))}
				</div>
				<div className='flex justify-between'>
					<button
						type='button'
						onClick={selectAll}
						className='px-3 py-1 rounded bg-slate-600'
					>
						Select All
					</button>
					<button
						type='button'
						onClick={deselectAll}
						className='px-3 py-1 rounded bg-slate-600'
					>
						Deselect All
					</button>
					<button
						type='button'
						onClick={() => {
							onApply(localSelection);
							onClose();
						}}
						className='px-3 py-1 rounded bg-sky-500'
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	);
};

export default ColumnsModal;
