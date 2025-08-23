import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { beforeEach, vi, describe, it, expect, type Mock } from 'vitest';
import { useFormStore } from '../store/useFormStore';
import MainPage from '../pages/MainPage';

type FormDataEntry = {
	name: string;
	age: number;
	email: string;
	password?: string;
	gender?: string;
	country?: string;
	avatar?: string | null;
	acceptTnC: boolean;
};

type FormStoreState = {
	submittedData: FormDataEntry[];
};

type MockUseFormStore = Mock<() => FormStoreState>;

vi.mock('../store/useFormStore', () => ({
	useFormStore: vi.fn(),
}));

vi.mock('../components/FormUncontrolled', () => ({
	default: () => <div>FormUncontrolled Mock</div>,
}));

vi.mock('../components/FormHook', () => ({
	default: () => <div>FormHook Mock</div>,
}));

vi.mock('../components/Modal', () => ({
	default: ({
		children,
		isOpen,
		onClose,
	}: {
		children: React.ReactNode;
		isOpen: boolean;
		onClose: () => void;
	}) => {
		if (!isOpen) return null;
		return (
			<div data-testid='modal'>
				<button onClick={onClose}>Close</button>
				{children}
			</div>
		);
	},
}));

describe('MainPage', () => {
	const mockUseFormStore = vi.mocked(useFormStore) as MockUseFormStore;

	beforeEach(() => {
		cleanup();
		vi.clearAllMocks();

		mockUseFormStore.mockReturnValue({
			submittedData: [],
		});
	});

	it('renders the main buttons correctly', () => {
		render(<MainPage />);

		expect(screen.getByRole('button', { name: /Open Uncontrolled Form/i })).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /Open Hook Form/i })).toBeInTheDocument();
	});

	it('opens the Uncontrolled Form modal when the button is clicked', () => {
		render(<MainPage />);
		const uncontrolledButton = screen.getByRole('button', { name: /Open Uncontrolled Form/i });

		fireEvent.click(uncontrolledButton);

		expect(screen.getByTestId('modal')).toBeInTheDocument();
		expect(screen.getByText(/Fill the form/i)).toBeInTheDocument();
		expect(screen.getByText(/FormUncontrolled Mock/i)).toBeInTheDocument();
	});

	it('opens the Hook Form modal when the button is clicked', () => {
		render(<MainPage />);
		const hookButton = screen.getByRole('button', { name: /Open Hook Form/i });

		fireEvent.click(hookButton);

		expect(screen.getByTestId('modal')).toBeInTheDocument();
		expect(screen.getByText(/Fill the form/i)).toBeInTheDocument();
		expect(screen.getByText(/FormHook Mock/i)).toBeInTheDocument();
	});

	it('displays submitted data correctly', () => {
		const mockData: FormDataEntry[] = [
			{
				name: 'John Doe',
				age: 30,
				email: 'john@example.com',
				password: 'password123',
				gender: 'Male',
				country: 'USA',
				avatar: null,
				acceptTnC: true,
			},
		];
		mockUseFormStore.mockReturnValue({
			submittedData: mockData,
		});

		render(<MainPage />);

		expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
		expect(screen.getByText(/30/i)).toBeInTheDocument();
		expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
		expect(screen.getByText(/password123/i)).toBeInTheDocument();
		expect(screen.getByText(/Male/i)).toBeInTheDocument();
		expect(screen.getByText(/USA/i)).toBeInTheDocument();
		expect(screen.getByText(/No avatar uploaded/i)).toBeInTheDocument();
		expect(screen.getByText(/Yes/i)).toBeInTheDocument();
	});
});
