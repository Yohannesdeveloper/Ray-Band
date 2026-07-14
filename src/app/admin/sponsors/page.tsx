import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  Handshake,
  Plus,
  Search,
  Building2,
  MapPin,
  TrendingUp,
  Clock,
  Users,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  prospect: "bg-gray-500/10 text-gray-400",
  initial_contact: "bg-blue-500/10 text-blue-400",
  discovery_meeting: "bg-cyan-500/10 text-cyan-400",
  proposal_sent: "bg-amber-500/10 text-amber-400",
  negotiation: "bg-orange-500/10 text-orange-400",
  approved: "bg-green-500/10 text-green-400",
  rejected: "bg-red-500/10 text-red-400",
  active: "bg-emerald-500/10 text-emerald-400",
  renewed: "bg-violet-500/10 text-violet-400",
  closed: "bg-gray-500/10 text-gray-400",
};

const statusLabels: Record<string, string> = {
  prospect: "Prospect",
  initial_contact: "Initial Contact",
  discovery_meeting: "Discovery Meeting",
  proposal_sent: "Proposal Sent",
  negotiation: "Negotiation",
  approved: "Approved",
  rejected: "Rejected",
  active: "Active",
  renewed: "Renewed",
  closed: "Closed",
};

export const dynamic = "force-dynamic";

export default async function SponsorsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; industry?: string; search?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, unknown> = {};
  if (params.status) where.status = params.status;
  if (params.industry) where.industry = params.industry;
  if (params.search) {
    where.OR = [
      { companyName: { contains: params.search } },
      { industry: { contains: params.search } },
      { city: { contains: params.search } },
    ];
  }

  const sponsors = await db.sponsor.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      communications: { orderBy: { createdAt: "desc" }, take: 1 },
      contacts: true,
      sponsorships: true,
    },
  });

  const totalSponsors = sponsors.length;
  const activeSponsors = sponsors.filter((s) => s.status === "active").length;
  const pipelineSponsors = sponsors.filter(
    (s) =>
      s.status === "prospect" ||
      s.status === "initial_contact" ||
      s.status === "discovery_meeting" ||
      s.status === "proposal_sent" ||
      s.status === "negotiation"
  ).length;
  const totalValue = sponsors.reduce((sum, s) => sum + s.totalValue, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white flex items-center gap-3">
            <Handshake className="w-8 h-8 text-gold" />
            Sponsors
          </h1>
          <p className="text-warm-white/40 mt-1">
            Manage sponsor relationships, pipelines, and communications
          </p>
        </div>
        <Link href="/admin/sponsors/new">
          <Button variant="primary" className="gap-2">
            <Plus className="w-4 h-4" /> Add Sponsor
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card variant="glass" className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Building2 className="w-4 h-4 text-warm-white/40" />
          </div>
          <p className="text-2xl font-bold text-warm-white">{totalSponsors}</p>
          <p className="text-xs text-warm-white/40">Total Sponsors</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-4 h-4 text-emerald-400/60" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{activeSponsors}</p>
          <p className="text-xs text-warm-white/40">Active</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="w-4 h-4 text-amber-400/60" />
          </div>
          <p className="text-2xl font-bold text-amber-400">{pipelineSponsors}</p>
          <p className="text-xs text-warm-white/40">In Pipeline</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <div className="flex items-center justify-center mb-1">
            <Clock className="w-4 h-4 text-gold/60" />
          </div>
          <p className="text-2xl font-bold text-gold">
            {formatCurrency(totalValue, "ETB")}
          </p>
          <p className="text-xs text-warm-white/40">Total Value</p>
        </Card>
      </div>

      <form className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="text"
            name="search"
            defaultValue={params.search || ""}
            placeholder="Search sponsors..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <select
            name="status"
            defaultValue={params.status || ""}
            className="appearance-none pl-10 pr-10 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer"
          >
            <option value="">All Statuses</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 rounded-lg bg-gold text-charcoal font-medium text-sm hover:bg-gold-light transition-colors"
        >
          Search
        </button>
      </form>

      {sponsors.length === 0 ? (
        <div className="text-center py-20">
          <Handshake className="w-16 h-16 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No sponsors yet</p>
          <p className="text-warm-white/30 text-sm mb-6">
            Start building relationships with potential sponsors.
          </p>
          <Link href="/admin/sponsors/new">
            <Button variant="primary" className="gap-2">
              <Plus className="w-4 h-4" /> Add First Sponsor
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sponsors.map((sponsor) => (
            <Link key={sponsor.id} href={`/admin/sponsors/${sponsor.id}`}>
              <Card variant="hover" className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                      {sponsor.logoUrl ? (
                        <img
                          src={sponsor.logoUrl}
                          alt={sponsor.companyName}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      ) : (
                        <Building2 className="w-5 h-5 text-gold/60" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-warm-white text-sm truncate">
                        {sponsor.companyName}
                      </h3>
                      {sponsor.industry && (
                        <p className="text-xs text-warm-white/40 truncate">
                          {sponsor.industry}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      statusColors[sponsor.status] || "bg-gray-500/10 text-gray-400"
                    }`}
                  >
                    {statusLabels[sponsor.status] || sponsor.status}
                  </span>
                </div>

                {sponsor.contactPersonName && (
                  <div className="flex items-center gap-2 text-xs text-warm-white/50 mb-2">
                    <Users className="w-3 h-3" />
                    <span className="truncate">{sponsor.contactPersonName}</span>
                  </div>
                )}

                {sponsor.city && (
                  <div className="flex items-center gap-2 text-xs text-warm-white/50 mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">
                      {sponsor.city}, {sponsor.country}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <span className="text-sm font-bold text-gold">
                    {formatCurrency(sponsor.totalValue, sponsor.currency)}
                  </span>
                  {sponsor.communications[0] && (
                    <span className="text-[10px] text-warm-white/30 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(sponsor.communications[0].createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
