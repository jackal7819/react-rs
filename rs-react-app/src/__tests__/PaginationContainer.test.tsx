import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { PaginationContainer } from '../components/PaginationContainer';

describe('PaginationContainer', () => {
  afterEach(cleanup);

  it('renders page buttons correctly for pageCount <= 7', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationContainer
        currentPage={3}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
    expect(screen.queryByText('...')).toBeNull();
    expect(screen.getByText('Prev')).not.toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
  });

  it('disables Prev button on first page and Next on last page', () => {
    const onPageChange = vi.fn();
    const { rerender } = render(
      <PaginationContainer
        currentPage={1}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('Prev')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();

    rerender(
      <PaginationContainer
        currentPage={5}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('Prev')).not.toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls onPageChange with correct page when page buttons clicked', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationContainer
        currentPage={3}
        pageCount={5}
        onPageChange={onPageChange}
      />
    );
    fireEvent.click(screen.getByText('1'));
    expect(onPageChange).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByText('5'));
    expect(onPageChange).toHaveBeenCalledWith(5);
    fireEvent.click(screen.getByText('Prev'));
    expect(onPageChange).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('renders correct pages and ellipses for pageCount > 7 and currentPage in middle', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationContainer
        currentPage={5}
        pageCount={10}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('...').length).toBe(2);
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders correct pages and ellipses for pageCount > 7 and currentPage near start', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationContainer
        currentPage={2}
        pageCount={10}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getAllByText('...').length).toBe(1);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders correct pages and ellipses for pageCount > 7 and currentPage near end', () => {
    const onPageChange = vi.fn();
    render(
      <PaginationContainer
        currentPage={9}
        pageCount={10}
        onPageChange={onPageChange}
      />
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('...').length).toBe(1);
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
