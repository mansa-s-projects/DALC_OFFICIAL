"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-luxury-black">
      <h2 className="text-4xl font-display text-white">Something went wrong</h2>
      <p className="mt-2 text-lg text-gray-400">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded-md border border-luxury-gold/30 px-6 py-2 text-luxury-gold text-xs uppercase tracking-widest hover:bg-luxury-gold/10 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
