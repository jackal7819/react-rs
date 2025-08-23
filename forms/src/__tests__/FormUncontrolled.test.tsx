import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import FormUncontrolled from '../components/FormUncontrolled';

vi.mock('../store/useFormStore', () => ({
	useFormStore: () => ({
		addData: vi.fn(),
	}),
}));

vi.mock('../store/useCountryStore', () => ({
	useCountryStore: () => ({
		countries: [
			{ name: 'United States', code: 'US' },
			{ name: 'Canada', code: 'CA' },
		],
	}),
}));

vi.mock('../utils/formHelpers', () => ({
	checkPasswordStrength: vi.fn(() => ({
		met: [],
		unmet: [],
		strength: 0,
	})),
	fileToBase64: vi.fn(() => Promise.resolve('base64string')),
}));

vi.mock('../utils/validation', () => ({
	formSchema: {
		parse: vi.fn((data) => {
			if (data.email === 'invalid') {
				throw {
					issues: [{ path: ['email'], message: 'Invalid email' }],
				};
			}
			return data;
		}),
	},
}));

const onCloseMock = vi.fn();
const addDataMock = vi.fn();

beforeEach(() => {
	cleanup();
	vi.clearAllMocks();
	vi.mocked(addDataMock).mockClear();

	vi.mock('../store/useFormStore', () => ({
		useFormStore: () => ({
			addData: addDataMock,
		}),
	}));
});

describe('FormUncontrolled', () => {
	it('must render the form with the submit button disabled', () => {
		render(<FormUncontrolled onClose={onCloseMock} />);
		expect(screen.getByRole('button', { name: /Submit/i })).toBeDisabled();
		expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Terms and Conditions/i)).not.toBeChecked();
	});

	it('should include a submit button when all fields are filled in with valid data', async () => {
		render(<FormUncontrolled onClose={onCloseMock} />);
		const submitButton = screen.getByRole('button', { name: /Submit/i });

		fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'John Doe' } });
		fireEvent.change(screen.getByPlaceholderText(/Age/i), { target: { value: '30' } });
		fireEvent.change(screen.getByPlaceholderText(/Email/i), {
			target: { value: 'test@example.com' },
		});
		fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
			target: { value: 'StrongPass123!' },
		});
		fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
			target: { value: 'StrongPass123!' },
		});
		fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'male' } });
		fireEvent.change(screen.getByPlaceholderText(/Start typing country.../i), {
			target: { value: 'United States' },
		});
		fireEvent.click(screen.getByLabelText(/Terms and Conditions/i));

		const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
		const fileInput = screen.getByLabelText(/Avatar/i);
		fireEvent.change(fileInput, { target: { files: [file] } });

		await waitFor(() => {
			expect(submitButton).not.toBeDisabled();
		});
	});

	it('must submit the form and call onClose with valid data', async () => {
		render(<FormUncontrolled onClose={onCloseMock} />);

		fireEvent.change(screen.getByPlaceholderText(/Name/i), { target: { value: 'Jane Smith' } });
		fireEvent.change(screen.getByPlaceholderText(/Age/i), { target: { value: '25' } });
		fireEvent.change(screen.getByPlaceholderText(/Email/i), {
			target: { value: 'jane@example.com' },
		});
		fireEvent.change(screen.getByPlaceholderText(/^Password$/i), {
			target: { value: 'Password123!' },
		});
		fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), {
			target: { value: 'Password123!' },
		});
		fireEvent.change(screen.getByLabelText(/Gender/i), { target: { value: 'female' } });
		fireEvent.change(screen.getByPlaceholderText(/Start typing country.../i), {
			target: { value: 'Canada' },
		});
		fireEvent.click(screen.getByLabelText(/Terms and Conditions/i));

		const file = new File(['avatar'], 'avatar.jpeg', { type: 'image/jpeg' });
		fireEvent.change(screen.getByLabelText(/Avatar/i), { target: { files: [file] } });

		await waitFor(() => {
			expect(screen.getByRole('button', { name: /Submit/i })).not.toBeDisabled();
		});

		fireEvent.click(screen.getByRole('button', { name: /Submit/i }));

		await waitFor(() => {
			expect(addDataMock).toHaveBeenCalledWith(
				expect.objectContaining({
					name: 'Jane Smith',
					email: 'jane@example.com',
					country: 'Canada',
					avatar: 'base64string',
				})
			);
			expect(onCloseMock).toHaveBeenCalledTimes(1);
		});
	});

	it('should display a list of countries when text is entered', async () => {
		render(<FormUncontrolled onClose={onCloseMock} />);
		const countryInput = screen.getByPlaceholderText(/Start typing country.../i);

		fireEvent.change(countryInput, { target: { value: 'united' } });
		fireEvent.focus(countryInput);

		await waitFor(() => {
			expect(screen.getByText('United States')).toBeInTheDocument();
			expect(screen.queryByText('Canada')).not.toBeInTheDocument();
		});

		fireEvent.mouseDown(screen.getByText('United States'));

		await waitFor(() => {
			expect(countryInput).toHaveValue('United States');
			expect(screen.queryByText('United States')).not.toBeInTheDocument();
		});
	});
});
