import { useQuery } from '@tanstack/react-query';
import { Character } from '@/types';

const MINUTE = 1000 * 60;

export function useCharacterQuery(id: number | null) {
	return useQuery({
		queryKey: ['character', id],
		queryFn: async () => {
			if (id == null) return null as unknown as Character;
			const res = await fetch(`/api/character/${id}`);
			if (!res.ok) throw new Error('Failed to load character');
			return (await res.json()) as Character;
		},
		enabled: id != null,
		staleTime: 5 * MINUTE,
		gcTime: 10 * MINUTE,
	});
}
