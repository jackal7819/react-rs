import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { useCountryStore } from '../store/useCountryStore';
import { useFormStore } from '../store/useFormStore';
import { fileToBase64 } from '../utils/formHelpers';
import FormHook from '../components/FormHook';

vi.mock('../store/useFormStore');
vi.mock('../store/useCountryStore');
vi.mock('../utils/formHelpers');

const mockAddData = vi.fn();
const mockOnClose = vi.fn();
const mockFileToBase64 = vi.fn();

const mockCountries = [
	{ name: 'United States', code: 'US' },
	{ name: 'United Kingdom', code: 'GB' },
	{ name: 'Canada', code: 'CA' },
];

describe('FormHook', () => {
	beforeEach(() => {
		cleanup();
		vi.clearAllMocks();
		vi.mocked(useFormStore).mockReturnValue({ addData: mockAddData });
		vi.mocked(useCountryStore).mockReturnValue({ countries: mockCountries });
		vi.mocked(fileToBase64).mockImplementation(mockFileToBase64);

		mockFileToBase64.mockResolvedValue('data:image/jpeg;base64,mockedbase64string');
	});

	it('the send button should be inactive during initial rendering', () => {
		render(<FormHook onClose={mockOnClose} />);
		const submitButton = screen.getByRole('button', { name: /Submit/i });
		expect(submitButton).toBeDisabled();
	});

	it('should display suggestions by country when entering', async () => {
		render(<FormHook onClose={mockOnClose} />);
		const user = userEvent.setup();
		const countryInput = screen.getByLabelText(/Country \*/i);

		await user.type(countryInput, 'united');

		const suggestionsList = screen.getByRole('list');
		expect(suggestionsList).toBeInTheDocument();
		expect(screen.getByText('United States')).toBeInTheDocument();
		expect(screen.getByText('United Kingdom')).toBeInTheDocument();
		expect(screen.queryByText('Canada')).not.toBeInTheDocument();
	});

	it('must fill in the country field when selecting an offer', async () => {
		render(<FormHook onClose={mockOnClose} />);
		const user = userEvent.setup();
		const countryInput = screen.getByLabelText(/Country \*/i);

		await user.type(countryInput, 'united');
		const unitedStatesOption = screen.getByText('United States');

		fireEvent.mouseDown(unitedStatesOption);
		expect(countryInput).toHaveValue('United States');
	});
});
