"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8 rounded-2xl bg-surface border border-border">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-400 text-xl">!</span>
        </div>
        <h2 className="text-lg font-bold text-warm-white mb-2">
          Something went wrong
        </h2>
        <p className="text-sm text-warm-white/50 mb-1">
          {error.message || "An unexpected error occurred"}
        </p>
        {error.digest && (
          <p className="text-xs text-warm-white/30 font-mono mb-4">
            Digest: {error.digest}
          </p>
        )}
        {process.env.NODE_ENV === "development" && error.stack && (
          <pre className="text-xs text-red-400/70 text-left mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10 overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap">
            {error.stack}
          </pre>
        )}
        <button
          onClick={reset}
          className="mt-6 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/20 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
