"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0A] text-[#F5F0EB] antialiased">
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto p-8 rounded-2xl bg-[#111111] border border-[#2A2A2A]">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-xl">!</span>
            </div>
            <h2 className="text-lg font-bold mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-white/50 mb-1">
              {error.digest
                ? `Error ID: ${error.digest}`
                : "An unexpected error occurred"}
            </p>
            <button
              onClick={reset}
              className="mt-6 px-4 py-2 rounded-lg bg-[#D4A853]/10 border border-[#D4A853]/20 text-[#D4A853] text-sm font-medium hover:bg-[#D4A853]/20 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
