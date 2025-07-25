import { cleanup, render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { ErrorPage } from '../pages/ErrorPage';

describe('ErrorPage Component', () => {
  afterEach(cleanup);

  it('renders the 404 error code', () => {
    const Stub = createRoutesStub([
      {
        path: '*',
        Component: ErrorPage,
      },
    ]);

    render(<Stub initialEntries={['/non-existent-page']} />);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('renders the "page not found" heading', () => {
    const Stub = createRoutesStub([
      {
        path: '*',
        Component: ErrorPage,
      },
    ]);

    render(<Stub initialEntries={['/non-existent-page']} />);

    expect(screen.getByText('page not found')).toBeInTheDocument();
  });

  it('renders the error message paragraph', () => {
    const Stub = createRoutesStub([
      {
        path: '*',
        Component: ErrorPage,
      },
    ]);

    render(<Stub initialEntries={['/non-existent-page']} />);

    expect(
      screen.getByText(
        'Sorry, we could not find the page you are looking for...'
      )
    ).toBeInTheDocument();
  });

  it('renders the "go back home" link', () => {
    const Stub = createRoutesStub([
      {
        path: '*',
        Component: ErrorPage,
      },
    ]);

    render(<Stub initialEntries={['/non-existent-page']} />);

    const link = screen.getByRole('link', { name: /go back home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });
});
