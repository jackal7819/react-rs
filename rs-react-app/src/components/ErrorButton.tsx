import { useState } from 'react';

export const ErrorButton = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Checking ErrorBoundary');
  }

  return (
    <button
      type="button"
      className="bg-rose-500 font-medium rounded-lg text-xl px-5 py-2.5 text-center flex items-center text-black hover:bg-rose-600 duration-500 cursor-pointer w-full justify-center"
      onClick={() => setShouldThrow(true)}
    >
      Throw Error
    </button>
  );
};
