import { useQueryClient } from '@tanstack/react-query';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const queryClient = useQueryClient();
  const [term, setTerm] = useLocalStorage('searchTerm', '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const handleSearch = () => {
    const trimmed = term.trim();
    setTerm(trimmed);
    onSearch(trimmed);
    queryClient.refetchQueries({
      queryKey: ['characters', trimmed],
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 py-4">
      <input
        placeholder="Search..."
        name="search"
        type="search"
        aria-label="Search characters"
        className="appearance-none outline-none w-full border-2 bg-transparent focus:border-amber-500 font-medium rounded-lg text-xl px-5 py-2.5 me-2 inline-flex items-center text-white duration-500 border-slate-400"
        value={term}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className="bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer"
        onClick={() =>
          queryClient.invalidateQueries({ queryKey: ['characters'] })
        }
      >
        Refresh
      </button>
      <button
        type="button"
        className="bg-amber-600 font-medium rounded-lg text-xl px-5 py-2.5 text-center inline-flex items-center text-black hover:bg-amber-500 duration-500 cursor-pointer"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
};
