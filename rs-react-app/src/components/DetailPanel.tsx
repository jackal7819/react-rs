import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { fetchCharacterById } from '../api';
import { Character } from '../types';
import { Loader } from './Loader';

export const DetailPanel = () => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const id = searchParams.get('details');

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCharacterById(Number(id));
        setCharacter(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('Failed to load character.');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [id]);

  const handleClose = () => {
    searchParams.delete('details');
    setSearchParams(searchParams);
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-rose-500">{error}</div>;
  if (!character) return null;

  return (
    <div className="relative p-4 rounded-lg bg-slate-800">
      <button
        type="button"
        className="absolute text-2xl duration-500 cursor-pointer top-4 right-4 text-slate-400 hover:text-white"
        onClick={handleClose}
        aria-label="Close details"
      >
        ✖
      </button>

      <h2 className="mb-2 text-2xl font-bold">{character.name}</h2>

      <img
        src={character.image}
        alt={character.name}
        className="mb-4 rounded-lg"
      />

      <ul className="space-y-1 text-lg">
        <li>
          <strong>Status:</strong> {character.status}
        </li>
        <li>
          <strong>Species:</strong> {character.species}
        </li>
        {character.type && (
          <li>
            <strong>Type:</strong> {character.type}
          </li>
        )}
        <li>
          <strong>Gender:</strong> {character.gender}
        </li>
        <li>
          <strong>Origin:</strong> {character.origin?.name}
        </li>
        <li>
          <strong>Location:</strong> {character.location?.name}
        </li>
        <li>
          <strong>Episodes:</strong> {character.episode?.length ?? 0}
        </li>
      </ul>
    </div>
  );
};
