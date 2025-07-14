import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { Card } from './Card';

describe('Card component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders name and description correctly', () => {
    render(
      <Card name="Test Name" description="Test Description" image="test.png" />
    );

    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test.png');
  });

  it('handles missing props gracefully', () => {
    render(<Card />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByText(/Test Name/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Test Description/)).not.toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 2 });
    const paragraph = screen.getByText('', { selector: 'p' });

    expect(heading.textContent).toBe('');
    expect(paragraph.textContent).toBe('');
  });
});
