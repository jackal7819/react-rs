import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Outlet } from 'react-router';

import { Character } from '../types';
import { fetchCharacters } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { SearchBar } from '../components/SearchBar';
import { Loader } from '../components/Loader';
import { CardList } from '../components/CardList';
import { PaginationContainer } from '../components/PaginationContainer';
import { ErrorButton } from '../components/ErrorButton';

export const HomePage = () => {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [term] = useLocalStorage('searchTerm', '');

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const detailsId = searchParams.get('details');

  const fetchData = useCallback(async (term: string, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchCharacters(term, page);
      setData(response.results);
      setPageCount(response.info.pages);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(term, page);
  }, [term, page, fetchData]);

  const handleCardClick = (id: number) => {
    setSearchParams({ page: String(page), details: String(id) });
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen antialiased text-slate-400 bg-slate-900">
        <div className="flex gap-4 p-4 mx-auto max-w-7xl">
          <div className="w-full">
            <SearchBar
              onSearch={(term) => {
                setSearchParams({ page: '1' });
                fetchData(term, 1);
              }}
            />
            {loading ? (
              <div className="flex items-center justify-center w-full h-[50vh]">
                <Loader />
              </div>
            ) : error ? (
              <div className="py-4 text-rose-500">{error}</div>
            ) : (
              <>
                <CardList data={data} onCardClick={handleCardClick} />
                <PaginationContainer
                  currentPage={page}
                  pageCount={pageCount}
                  onPageChange={(newPage) =>
                    setSearchParams({ page: String(newPage) })
                  }
                />
              </>
            )}
            <ErrorButton />
          </div>

          {detailsId && (
            <div className="w-1/2 pl-4 border-l border-slate-700">
              <Outlet />
            </div>
          )}
        </div>
      </main>
    </ErrorBoundary>
  );
};
