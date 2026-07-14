"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const EVENT_CATEGORIES = [
  "concert", "wedding", "corporate", "festival", "government",
  "university", "hotel", "club", "birthday", "cultural",
  "religious", "charity", "private",
];

const EVENT_STATUSES = [
  "draft", "planning", "proposal", "negotiation", "contract_signed",
  "preparation", "marketing", "production", "live_event", "post_event", "archived",
];

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

interface EventFiltersProps {
  search: string;
  category: string;
  status: string;
  view: string;
}

function buildUrl(current: { search: string; category: string; status: string; view: string }, overrides: Record<string, string>) {
  const sp = new URLSearchParams();
  const search = overrides.search !== undefined ? overrides.search : current.search;
  const category = overrides.category !== undefined ? overrides.category : current.category;
  const status = overrides.status !== undefined ? overrides.status : current.status;
  const view = overrides.view !== undefined ? overrides.view : current.view;
  if (search) sp.set("search", search);
  if (category) sp.set("category", category);
  if (status) sp.set("status", status);
  sp.set("view", view);
  const qs = sp.toString();
  return `/admin/events${qs ? `?${qs}` : ""}`;
}

export function EventFilters({ search, category, status, view }: EventFiltersProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col lg:flex-row gap-3 mb-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          router.push(buildUrl({ search, category, status, view }, { search: (fd.get("search") as string) || "" }));
        }}
        className="flex flex-1 gap-3"
      >
        {category && <input type="hidden" name="category" value={category} />}
        {status && <input type="hidden" name="status" value={status} />}
        <input type="hidden" name="view" value={view} />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="text"
            name="search"
            placeholder="Search events..."
            defaultValue={search}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <button type="submit" className="px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm hover:bg-surface-lighter transition-colors cursor-pointer">
          Search
        </button>
      </form>
      <div className="flex gap-3">
        <div className="relative">
          <select
            defaultValue={category}
            className="pl-4 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
            onChange={(e) => {
              router.push(buildUrl({ search, category, status, view }, { category: e.target.value }));
            }}
          >
            <option value="">All Categories</option>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{statusLabel(c)}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>
        <div className="relative">
          <select
            defaultValue={status}
            className="pl-4 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
            onChange={(e) => {
              router.push(buildUrl({ search, category, status, view }, { status: e.target.value }));
            }}
          >
            <option value="">All Statuses</option>
            {EVENT_STATUSES.map((s) => (
              <option key={s} value={s}>{statusLabel(s)}</option>
            ))}
          </select>
          <ChevronDownIcon />
        </div>
      </div>
    </div>
  );
}

function ChevronDownIcon() {
  return (
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
