import { cleanup, render, screen } from '@testing-library/react';
import { describe, test, expect, afterEach } from 'vitest';
import { Loader } from '../components/Loader';

describe('Loader Component', () => {
  afterEach(cleanup);

  test('renders loading text', () => {
    render(<Loader />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('renders spinner svg', () => {
    render(<Loader />);
    const svg = screen.getByRole('status');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('animate-spin');
  });

  test('has aria-label for accessibility', () => {
    render(<Loader />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Loading');
  });

  test('button is disabled while loading', () => {
    render(<Loader />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });
});
