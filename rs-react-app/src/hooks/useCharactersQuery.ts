import { useQuery } from '@tanstack/react-query';
import { fetchCharacters } from '../api';

export const useCharactersQuery = (term: string, page: number) => {
  return useQuery({
    queryKey: ['characters', term, page],
    queryFn: () => fetchCharacters(term, page),
  });
};
