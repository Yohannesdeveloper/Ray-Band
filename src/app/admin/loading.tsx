export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="h-9 w-64 bg-charcoal-lighter rounded-lg animate-pulse" />
        <div className="h-4 w-80 bg-charcoal-lighter/50 rounded mt-2 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-charcoal-lighter rounded animate-pulse" />
                <div className="h-7 w-20 bg-charcoal-lighter rounded animate-pulse" />
              </div>
              <div className="w-10 h-10 rounded-lg bg-charcoal-lighter animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass rounded-2xl p-6">
            <div className="h-5 w-40 bg-charcoal-lighter rounded mb-6 animate-pulse" />
            <div className="h-56 bg-charcoal-lighter/50 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
