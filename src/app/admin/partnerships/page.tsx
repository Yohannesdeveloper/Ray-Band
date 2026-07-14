import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Handshake,
  Plus,
  Building2,
  Globe,
  Mail,
  Phone,
  Users,
  TrendingUp,
} from "lucide-react";
import { PartnershipFilters } from "@/components/admin/partnership-filters";

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

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "gold" | "red" | "outline" | "glass" }> = {
  prospect: { label: "Prospect", variant: "outline" },
  contacted: { label: "Contacted", variant: "gold" },
  negotiating: { label: "Negotiating", variant: "glass" },
  active: { label: "Active", variant: "default" },
  inactive: { label: "Inactive", variant: "red" },
  expired: { label: "Expired", variant: "red" },
};

export const dynamic = "force-dynamic";

export default async function PartnershipsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, string> = {};
  if (params.category) where.category = params.category;
  if (params.status) where.status = params.status;

  const partnerships = await db.partnership.findMany({
    where,
    include: {
      contacts: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const allPartnerships = await db.partnership.findMany({
    select: { category: true, status: true, totalValue: true },
  });

  const stats = {
    total: allPartnerships.length,
    active: allPartnerships.filter((p) => p.status === "active").length,
    totalValue: allPartnerships.reduce((s, p) => s + p.totalValue, 0),
    byCategory: Object.entries(
      allPartnerships.reduce(
        (acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      )
    ).sort((a, b) => b[1] - a[1]),
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white flex items-center gap-3">
            <Handshake className="w-8 h-8 text-gold" />
            Partnerships
          </h1>
          <p className="text-warm-white/40 mt-1">
            Manage organizational partnerships and collaborations
          </p>
        </div>
        <Link href="/admin/partnerships/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Add Partnership
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <Card variant="glass" className="p-4 text-center">
          <Building2 className="w-5 h-5 text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-warm-white">{stats.total}</p>
          <p className="text-xs text-warm-white/40">Total Partners</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
          <p className="text-xs text-warm-white/40">Active</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <Users className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-amber-400">{stats.byCategory.length}</p>
          <p className="text-xs text-warm-white/40">Categories</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <TrendingUp className="w-5 h-5 text-gold mx-auto mb-2" />
          <p className="text-2xl font-bold text-gold">ETB {stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-warm-white/40">Total Value</p>
        </Card>
      </div>

      {stats.byCategory.length > 0 && (
        <Card variant="bordered" className="p-5 mb-8">
          <h3 className="text-sm font-medium text-warm-white/60 mb-3">Partners by Category</h3>
          <div className="flex flex-wrap gap-2">
            {stats.byCategory.map(([cat, count]) => (
              <Link
                key={cat}
                href={`/admin/partnerships?category=${cat}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-light border border-border text-xs text-warm-white/70 hover:border-gold/50 hover:text-gold transition-colors"
              >
                {CATEGORIES[cat] || cat}
                <span className="font-bold text-gold">{count}</span>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <PartnershipFilters category={params.category || ""} status={params.status || ""} />

      {partnerships.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Handshake className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No partnerships yet</p>
          <p className="text-warm-white/30 text-sm mb-6">
            Start building your partner network by adding your first partnership.
          </p>
          <Link href="/admin/partnerships/new">
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Add Partnership
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partnerships.map((p) => {
            const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.prospect;
            const primaryContact = p.contacts[0];
            return (
              <Link key={p.id} href={`/admin/partnerships/${p.id}`}>
                <Card variant="hover" className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="gold" size="sm">
                      {CATEGORIES[p.category] || p.category}
                    </Badge>
                    <Badge variant={status.variant} size="sm">
                      {status.label}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-warm-white mb-1 line-clamp-1">
                    {p.organizationName}
                  </h3>
                  {primaryContact && (
                    <p className="text-xs text-warm-white/50 mb-3">
                      Contact: {primaryContact.name}
                    </p>
                  )}
                  <div className="space-y-1.5 mt-auto">
                    {p.website && (
                      <div className="flex items-center gap-2 text-xs text-warm-white/40">
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{p.website}</span>
                      </div>
                    )}
                    {p.email && (
                      <div className="flex items-center gap-2 text-xs text-warm-white/40">
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{p.email}</span>
                      </div>
                    )}
                    {p.phone && (
                      <div className="flex items-center gap-2 text-xs text-warm-white/40">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{p.phone}</span>
                      </div>
                    )}
                  </div>
                  {p.totalValue > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm font-medium text-gold">
                        ETB {p.totalValue.toLocaleString()}
                      </p>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
