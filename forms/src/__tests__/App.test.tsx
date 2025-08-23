import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';

vi.mock('./pages/MainPage', () => ({
	default: () => <main />,
}));

describe('App', () => {
	it('should render the MainPage component as a main element', () => {
		render(<App />);

		const mainElement = screen.getByRole('main');
		expect(mainElement).toBeInTheDocument();
	});
});
