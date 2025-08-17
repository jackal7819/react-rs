import { useQuery } from '@tanstack/react-query';
// import { fetchCharacters } from '../api';
import { ApiResponse } from '@/types';

const MINUTE = 1000 * 60;

// export const useCharactersQuery = (term: string, page: number) => {
//   return useQuery({
//     queryKey: ['characters', term, page],
//     queryFn: () => fetchCharacters(term, page),
//     staleTime: 5 * MINUTE,
//     gcTime: 10 * MINUTE,
//   });
// };

export function useCharactersQuery(term: string, page: number) {
	return useQuery({
		queryKey: ['characters', term, page],
		queryFn: async () => {
			const res = await fetch(
				`/api/characters?name=${encodeURIComponent(term)}&page=${page}`
			);
			if (!res.ok) {
				const { message } = await res
					.json()
					.catch(() => ({ message: 'Something went wrong' }));
				throw new Error(message);
			}
			return (await res.json()) as ApiResponse;
		},
		// enabled: !!term,
		staleTime: 5 * MINUTE,
		gcTime: 10 * MINUTE,
	});
}
