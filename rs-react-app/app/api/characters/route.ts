import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const term = searchParams.get('name') ?? '';
	const page = searchParams.get('page') ?? '1';
	const res = await fetch(`https://rickandmortyapi.com/api/character/?name=${term}&page=${page}`);
	const data: ApiResponse = await res.json();
	return NextResponse.json(data);
}
