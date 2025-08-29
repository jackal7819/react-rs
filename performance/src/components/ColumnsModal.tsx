import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

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

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const toggleColumn = (col: string) => {
		setLocalSelection((prev) =>
			prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
		);
	};

	const selectAll = () => setLocalSelection([...availableColumns]);
	const deselectAll = () => setLocalSelection([]);

	return createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/40'
			onClick={onClose}
		>
			<div
				className='bg-slate-800 text-white rounded p-6 w-80 max-h-[80vh] overflow-y-auto'
				onClick={(e) => e.stopPropagation()}
			>
				<h2 className='mb-4 text-lg font-bold'>Select Columns</h2>
				<div className='flex flex-col gap-2 mb-4'>
					{availableColumns.map((col) => (
						<label key={col} className='flex items-center gap-2 cursor-pointer'>
							<input
								type='checkbox'
								checked={localSelection.includes(col)}
								onChange={() => toggleColumn(col)}
								className='accent-sky-600'
							/>
							{col.replaceAll('_', ' ')}
						</label>
					))}
				</div>
				<div className='flex justify-between gap-5'>
					<button
						type='button'
						onClick={selectAll}
						className='px-3 py-1 duration-500 rounded cursor-pointer bg-slate-600 hover:bg-slate-400'
					>
						Select All
					</button>
					<button
						type='button'
						onClick={deselectAll}
						className='px-3 py-1 duration-500 rounded cursor-pointer bg-slate-600 hover:bg-slate-400'
					>
						Deselect All
					</button>
					<button
						type='button'
						onClick={() => {
							onApply(localSelection);
							onClose();
						}}
						className='px-3 py-1 duration-500 rounded cursor-pointer bg-sky-600 hover:bg-sky-400'
					>
						Apply
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
};

export default ColumnsModal;
