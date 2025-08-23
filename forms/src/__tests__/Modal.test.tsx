import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Modal from '../components/Modal';

describe('Modal', () => {
	beforeEach(() => {
		vi.mock('react-dom', async (importOriginal) => {
			const actual = await importOriginal<typeof import('react-dom')>();
			return {
				...actual,
				createPortal: (node: React.ReactNode) => node,
			};
		});
	});

	afterEach(() => {
		cleanup();
		vi.resetAllMocks();
	});

	const mockOnClose = vi.fn();

	it('should not render when isOpen is false', () => {
		render(
			<Modal isOpen={false} onClose={mockOnClose}>
				<div>Test Content</div>
			</Modal>
		);

		expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
	});

	it('should render when isOpen is true', () => {
		render(
			<Modal isOpen={true} onClose={mockOnClose}>
				<div>Test Content</div>
			</Modal>
		);

		expect(screen.getByText('Test Content')).toBeInTheDocument();
	});

	it('should call onClose when clicking the backdrop', () => {
		render(
			<Modal isOpen={true} onClose={mockOnClose}>
				<div>Test Content</div>
			</Modal>
		);

		const modalContent = screen.getByText('Test Content');
		fireEvent.click(modalContent.parentElement!);

		expect(mockOnClose).not.toHaveBeenCalled();

		const { container } = render(
			<Modal isOpen={true} onClose={mockOnClose}>
				<div>Test Content</div>
			</Modal>
		);

		const backdrop = container.querySelector('.fixed.inset-0.z-50');
		fireEvent.click(backdrop!);
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('should not call onClose when clicking the modal content', () => {
		render(
			<Modal isOpen={true} onClose={mockOnClose}>
				<div>Test Content</div>
			</Modal>
		);

		fireEvent.click(screen.getByText('Test Content'));
		expect(mockOnClose).not.toHaveBeenCalled();
	});

	it('should call onClose when the "Escape" key is pressed', () => {
		render(
			<Modal isOpen={true} onClose={mockOnClose}>
				<div>Test Content</div>
			</Modal>
		);

		fireEvent.keyDown(document, { key: 'Escape' });
		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});
