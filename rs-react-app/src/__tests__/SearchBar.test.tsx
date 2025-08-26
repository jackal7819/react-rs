import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest';
import { SearchBar } from '../components/SearchBar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('SearchBar Component', () => {
  const setup = (savedTerm: string | null = null) => {
    const queryClient = new QueryClient();
    const onSearch = vi.fn();

    if (savedTerm !== null) {
      localStorage.setItem('searchTerm', JSON.stringify(savedTerm));
    }

    render(
      <QueryClientProvider client={queryClient}>
        <SearchBar onSearch={onSearch} />
      </QueryClientProvider>
    );
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /search/i });

    return { input, button, onSearch };
  };

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders search input and search button', () => {
    const { input, button } = setup();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('displays previously saved search term from localStorage on mount', () => {
    const { input } = setup('Rick');
    expect(input.value).toBe('Rick');
  });

  it('shows empty input when no saved term exists', () => {
    const { input } = setup(null);
    expect(input.value).toBe('');
  });

  it('updates input value when user types', () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: 'Morty' } });
    expect(input.value).toBe('Morty');
  });

  it('saves trimmed search term to localStorage when search button is clicked', () => {
    const { input, button } = setup();
    fireEvent.change(input, { target: { value: '  Rick  ' } });
    fireEvent.click(button);
    expect(localStorage.getItem('searchTerm')).toBe(JSON.stringify('Rick'));
  });

  it('triggers search callback with correct parameters', () => {
    const { input, button, onSearch } = setup();
    fireEvent.change(input, { target: { value: '  Beth ' } });
    fireEvent.click(button);
    expect(onSearch).toHaveBeenCalledWith('Beth');
  });

  it('retrieves saved search term on component mount', () => {
    localStorage.setItem('searchTerm', JSON.stringify('Summer'));
    const { input } = setup();
    expect(input.value).toBe('Summer');
  });

  it('overwrites existing localStorage value when new search is performed', () => {
    localStorage.setItem('searchTerm', JSON.stringify('OldValue'));
    const { input, button } = setup();
    fireEvent.change(input, { target: { value: 'NewValue' } });
    fireEvent.click(button);
    expect(localStorage.getItem('searchTerm')).toBe(JSON.stringify('NewValue'));
  });
});
