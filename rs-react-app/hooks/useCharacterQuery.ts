import { useQuery } from '@tanstack/react-query';
import { fetchCharacterById } from '@/api';

const MINUTE = 1000 * 60;

export const useCharacterQuery = (id: number | null) => {
	return useQuery({
		queryKey: ['character', id],
		queryFn: () => fetchCharacterById(id as number),
		enabled: !!id,
		staleTime: 5 * MINUTE,
		gcTime: 10 * MINUTE,
	});
};
