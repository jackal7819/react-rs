import { ApiResponse } from './types';

export const fetchCharacters = async (
  term: string,
  page: number = 1
): Promise<ApiResponse> => {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${term}&page=${page}`
  );

  if (!res.ok) {
    let errorText = 'Something went wrong. Please try again.';

    if (res.status === 404) {
      errorText = 'No characters found. Please try another name.';
    } else if (res.status >= 500) {
      errorText = 'Server error. Please try again later.';
    }

    throw new Error(errorText);
  }

  const json: ApiResponse = await res.json();
  return json;
};
