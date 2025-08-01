import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import { Card } from '../components/Card';

describe('Card component', () => {
  afterEach(cleanup);

  it('renders all fields and image correctly', () => {
    render(
      <Card
        id={1}
        name="Test Name"
        status="Alive"
        species="Human"
        gender="Male"
        image="test.png"
      />
    );

    expect(screen.getByText('Test Name')).toBeInTheDocument();
    expect(screen.getByText('Alive')).toBeInTheDocument();
    expect(screen.getByText('Human - Male')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'test.png');
  });

  it('renders empty fields gracefully', () => {
    render(<Card id={2} name="" status="" species="" gender="" />);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    const headings = screen.getAllByRole('heading', { level: 2 });
    headings.forEach((h) => expect(h.textContent).toBe('Unknown'));

    const paragraphs = screen.getAllByText('Unknown', { selector: 'p' });
    paragraphs.forEach((p) => expect(p.textContent).toBe('Unknown'));
  });
});
