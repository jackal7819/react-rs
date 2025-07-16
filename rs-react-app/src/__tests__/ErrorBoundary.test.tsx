import userEvent from '@testing-library/user-event';
import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ErrorButton } from '../components/ErrorButton';

describe('ErrorBoundary', () => {
  afterEach(cleanup);
  it('catches errors in child components and shows fallback UI', async () => {
    const consoleErrorMock = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    const throwButton = screen.getByRole('button', { name: /throw error/i });
    expect(throwButton).toBeInTheDocument();

    await userEvent.click(throwButton);

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    expect(tryAgainButton).toBeInTheDocument();

    expect(consoleErrorMock).toHaveBeenCalled();

    consoleErrorMock.mockRestore();
  });

  it('resets error state when "Try again" button is clicked', async () => {
    render(
      <ErrorBoundary>
        <ErrorButton />
      </ErrorBoundary>
    );

    const throwButton = screen.getByRole('button', { name: /throw error/i });
    await userEvent.click(throwButton);

    expect(
      await screen.findByText(/something went wrong/i)
    ).toBeInTheDocument();

    const tryAgainButton = screen.getByRole('button', { name: /try again/i });
    await userEvent.click(tryAgainButton);

    expect(
      screen.getByRole('button', { name: /throw error/i })
    ).toBeInTheDocument();
  });
});
