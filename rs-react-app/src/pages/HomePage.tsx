import { useSearchParams, Outlet } from 'react-router';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SearchBar } from '../components/SearchBar';
import { Loader } from '../components/Loader';
import { CardList } from '../components/CardList';
import { PaginationContainer } from '../components/PaginationContainer';
import { Flyout } from '../components/Flyout';
import { useCharactersQuery } from '../hooks/useCharactersQuery';

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [term, setTerm] = useLocalStorage('searchTerm', '');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const detailsId = searchParams.get('details');

  const { data, isPending, isError, error } = useCharactersQuery(term, page);

  const handleCardClick = (id: number) => {
    setSearchParams({ page: String(page), details: String(id) });
  };

  return (
    <main
      className="min-h-screen antialiased bg-slate-200 dark:text-slate-400 dark:bg-slate-900 text-slate-700"
      onClick={() => {
        if (detailsId) {
          setSearchParams({ page: String(page) });
        }
      }}
    >
      <div className="flex gap-4 p-4 mx-auto max-w-7xl">
        <div className="w-full">
          <SearchBar
            onSearch={(newTerm) => {
              setTerm(newTerm);
              setSearchParams({ page: '1' });
            }}
          />
          {isPending ? (
            <div className="flex items-center justify-center w-full h-[50vh]">
              <Loader />
            </div>
          ) : isError ? (
            <div className="py-4 text-rose-500">{error.message}</div>
          ) : (
            <>
              <CardList
                data={data?.results || []}
                onCardClick={handleCardClick}
              />
              <Flyout />
              <PaginationContainer
                currentPage={page}
                pageCount={data?.info.pages || 1}
                onPageChange={(newPage) =>
                  setSearchParams({ page: String(newPage) })
                }
              />
            </>
          )}
        </div>

        {detailsId && (
          <div
            className="w-1/2 pl-4 border-l border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <Outlet />
          </div>
        )}
      </div>
    </main>
  );
};
