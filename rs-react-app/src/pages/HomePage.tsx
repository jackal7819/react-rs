import { useState, useEffect, useCallback } from 'react';

import { Loader } from '../components/Loader';
import { SearchBar } from '../components/SearchBar';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ErrorButton } from '../components/ErrorButton';
import { CardList } from '../components/CardList';
import { Character } from '../types';
import { fetchCharacters } from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { PaginationContainer } from '../components/PaginationContainer';

export const HomePage = () => {
  const [data, setData] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [term] = useLocalStorage('searchTerm', '');

  const fetchData = useCallback(async (term: string, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchCharacters(term, page);
      setData(response.results);
      setPageCount(response.info.pages);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [term]);

  useEffect(() => {
    fetchData(term, currentPage);
  }, [term, currentPage, fetchData]);

  return (
    <ErrorBoundary>
      <main className="min-h-screen antialiased text-slate-400 bg-slate-900">
        <div className="max-w-4xl p-4 mx-auto">
          <SearchBar onSearch={() => fetchData(term, 1)} />
          {loading && (
            <div className="flex items-center justify-center w-full h-[50vh]">
              <Loader />
            </div>
          )}
          {error ? (
            <div className="py-4 text-rose-500">{error}</div>
          ) : (
            <>
              <CardList data={data} />
              <PaginationContainer
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
              />
            </>
          )}
          <ErrorButton />
        </div>
      </main>
    </ErrorBoundary>
  );
};
