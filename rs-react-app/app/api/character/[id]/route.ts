import { NextResponse } from 'next/server';
import { Character } from '@/types';

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
	const { id } = await ctx.params;
	const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
	if (!res.ok) throw new Error('Failed to load character');
	const data: Character = await res.json();
	return NextResponse.json(data);
}
