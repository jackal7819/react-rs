import { useQuery } from '@tanstack/react-query';
import { fetchCharacterById } from '../api';

export const useCharacterQuery = (id: number | null) => {
  return useQuery({
    queryKey: ['character', id],
    queryFn: () => fetchCharacterById(id as number),
    enabled: !!id,
  });
};
