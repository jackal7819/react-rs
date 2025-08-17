'use server';

import type { CsvItem } from '@/types';

function escapeCsvValue(v: string | number | null | undefined) {
	const s = String(v ?? '');
	if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
	return s;
}

export async function compileCsv(items: CsvItem[]) {
	const headers = ['ID', 'Name', 'Status', 'Species', 'Gender'];
	const rows = items.map((item) => [item.id, item.name, item.status, item.species, item.gender]);
	const csv = [headers.join(','), ...rows.map((r) => r.map(escapeCsvValue).join(','))].join('\n');
	const filename = `${items.length}_items.csv`;
	return { filename, csv };
}
