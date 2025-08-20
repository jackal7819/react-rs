import { useEffect } from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
		document.addEventListener('keydown', handleEsc);
		return () => document.removeEventListener('keydown', handleEsc);
	}, [onClose]);

	if (!isOpen) return null;

	return ReactDOM.createPortal(
		<div
			className='fixed inset-0 z-50 flex items-center justify-center py-10 bg-black/50'
			onClick={onClose}
		>
			<div
				className='w-full max-w-lg p-10 rounded-lg shadow-lg border-5 bg-slate-900 text-slate-400 shadow-slate-400 border-slate-400 max-h-[90vh] overflow-y-auto'
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>,
		document.body
	);
};

export default Modal;
