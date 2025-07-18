import { Character } from './types';

export const fetchCharacters = async (term: string): Promise<Character[]> => {
  const res = await fetch(
    `https://rickandmortyapi.com/api/character/?name=${term}`
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

  const json = await res.json();
  return json.results;
};
