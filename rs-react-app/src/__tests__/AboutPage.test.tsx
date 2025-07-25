import { cleanup, render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createRoutesStub } from 'react-router';
import { AboutPage } from '../pages/AboutPage';

describe('AboutPage component (with router context)', () => {
  afterEach(cleanup);

  const Stub = createRoutesStub([
    {
      path: '/',
      Component: AboutPage,
    },
  ]);

  beforeEach(() => {
    render(<Stub initialEntries={['/']} />);
  });

  it('renders the heading with the author name', () => {
    expect(
      screen.getByRole('heading', { name: /about viktor filippov/i })
    ).toBeInTheDocument();
  });

  it('renders all three paragraphs with expected text', () => {
    expect(
      screen.getByText(
        /i'm a beginner frontend developer currently studying react/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /this application was created as part of my learning journey/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/to learn react and become a frontend developer/i)
    ).toBeInTheDocument();
  });

  it('contains RS School React course link with correct attributes', () => {
    const rsLink = screen.getByRole('link', {
      name: /rs school react course/i,
    });
    expect(rsLink).toBeInTheDocument();
    expect(rsLink).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
    expect(rsLink).toHaveAttribute('target', '_blank');
    expect(rsLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders a "Back to Home" link element', () => {
    const backLink = screen.getByRole('link', { name: /back to home/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveTextContent(/back to home/i);
    expect(backLink).not.toHaveAttribute('to');
  });
});
