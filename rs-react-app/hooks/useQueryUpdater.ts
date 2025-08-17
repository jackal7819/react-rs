import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const useQueryUpdater = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const update = (
		patch: Record<string, string | undefined>,
		opts: { method?: 'push' | 'replace'; scroll?: boolean } = {}
	) => {
		const method = opts.method ?? 'replace';
		const sp = new URLSearchParams(searchParams.toString());

		for (const [key, val] of Object.entries(patch)) {
			if (val === undefined || val === null || val === '') sp.delete(key);
			else sp.set(key, val);
		}

		const qs = sp.toString();
		const href = qs ? `${pathname}?${qs}` : pathname;

		if (method === 'push') router.push(href, { scroll: opts.scroll ?? false });
		else router.replace(href, { scroll: opts.scroll ?? false });
	};

	return update;
};
