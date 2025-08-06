import { useQuery } from '@tanstack/react-query';
import { fetchCharacters } from '../api';

const MINUTE = 1000 * 60;

export const useCharactersQuery = (term: string, page: number) => {
  return useQuery({
    queryKey: ['characters', term, page],
    queryFn: () => fetchCharacters(term, page),
    staleTime: 5 * MINUTE,
    gcTime: 10 * MINUTE,
  });
};
