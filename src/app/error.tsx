'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h2 className="text-4xl font-bold">Something went wrong!</h2>
      <p className="mt-2 text-lg text-muted-foreground">
        {error.message || 'An unexpected error occurred.'}
      </p>
      {error.digest && (
        <p className="mt-1 text-sm text-muted-foreground">
          Error digest: {error.digest}
        </p>
      )}
      <button
        onClick={() => reset()}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
