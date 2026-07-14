"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES: Record<string, string> = {
  government: "Government",
  ngo: "NGO",
  embassy: "Embassy",
  university: "University",
  hotel: "Hotel",
  resort: "Resort",
  corporate: "Corporate",
  media: "Media",
  tv_station: "TV Station",
  radio: "Radio",
  production: "Production",
  wedding_planner: "Wedding Planner",
  event_organizer: "Event Organizer",
  youth: "Youth",
  international: "International",
  church: "Church",
  community: "Community",
};

const STATUS_CONFIG: Record<string, { label: string }> = {
  prospect: { label: "Prospect" },
  contacted: { label: "Contacted" },
  negotiating: { label: "Negotiating" },
  active: { label: "Active" },
  inactive: { label: "Inactive" },
  expired: { label: "Expired" },
};

interface PartnershipFiltersProps {
  category: string;
  status: string;
}

export function PartnershipFilters({ category, status }: PartnershipFiltersProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative">
        <select
          defaultValue={category}
          className="px-4 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          onChange={(e) => {
            const sp = new URLSearchParams();
            if (e.target.value) sp.set("category", e.target.value);
            if (status) sp.set("status", status);
            router.push(`/admin/partnerships${sp.toString() ? `?${sp.toString()}` : ""}`);
          }}
        >
          <option value="">All Categories</option>
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>
      <div className="relative">
        <select
          defaultValue={status}
          className="px-4 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          onChange={(e) => {
            const sp = new URLSearchParams();
            if (category) sp.set("category", category);
            if (e.target.value) sp.set("status", e.target.value);
            router.push(`/admin/partnerships${sp.toString() ? `?${sp.toString()}` : ""}`);
          }}
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>{cfg.label}</option>
          ))}
        </select>
      </div>
      {(category || status) && (
        <Link
          href="/admin/partnerships"
          className="inline-flex items-center px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white/60 text-sm hover:text-warm-white transition-colors"
        >
          Clear Filters
        </Link>
      )}
    </div>
  );
}
