import { useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/types';

const MINUTE = 1000 * 60;

export function useCharactersQuery(term: string, page: number) {
	return useQuery<ApiResponse>({
		queryKey: ['characters', term, page],
		queryFn: async () => {
			const res = await fetch(
				`/api/characters?name=${encodeURIComponent(term)}&page=${page}`
			);
			if (!res.ok) throw new Error('Failed to load characters');

			const data: ApiResponse = await res.json();
			return data;
		},
		staleTime: 5 * MINUTE,
		gcTime: 10 * MINUTE,
	});
}
