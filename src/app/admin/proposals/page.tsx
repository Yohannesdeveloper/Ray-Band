import Link from "next/link";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Plus,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  PenLine,
  Filter,
  ChevronDown,
} from "lucide-react";

const TYPE_CONFIG: Record<string, { label: string; variant: "default" | "gold" | "red" | "outline" | "glass" }> = {
  company_profile: { label: "Company Profile", variant: "outline" },
  capability_statement: { label: "Capability Statement", variant: "outline" },
  sponsorship: { label: "Sponsorship", variant: "gold" },
  partnership: { label: "Partnership", variant: "gold" },
  government: { label: "Government", variant: "glass" },
  ngo: { label: "NGO", variant: "glass" },
  corporate: { label: "Corporate", variant: "default" },
  festival: { label: "Festival", variant: "gold" },
  wedding: { label: "Wedding", variant: "glass" },
  event: { label: "Event", variant: "glass" },
  grant: { label: "Grant", variant: "gold" },
  investment: { label: "Investment", variant: "gold" },
  funding: { label: "Funding", variant: "gold" },
  custom: { label: "Custom", variant: "outline" },
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "gold" | "red" | "outline" | "glass"; icon: typeof FileText }> = {
  draft: { label: "Draft", variant: "outline", icon: PenLine },
  review: { label: "Review", variant: "glass", icon: Clock },
  sent: { label: "Sent", variant: "gold", icon: Send },
  accepted: { label: "Accepted", variant: "default", icon: CheckCircle },
  rejected: { label: "Rejected", variant: "red", icon: XCircle },
  expired: { label: "Expired", variant: "red", icon: Clock },
};

export const dynamic = "force-dynamic";

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const params = await searchParams;
  const where: Record<string, string> = {};
  if (params.type) where.type = params.type;
  if (params.status) where.status = params.status;

  const proposals = await db.proposal.findMany({
    where,
    include: {
      author: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const allProposals = await db.proposal.findMany({
    select: { type: true, status: true, amount: true },
  });

  const stats = {
    total: allProposals.length,
    draft: allProposals.filter((p) => p.status === "draft").length,
    sent: allProposals.filter((p) => p.status === "sent").length,
    accepted: allProposals.filter((p) => p.status === "accepted").length,
    totalValue: allProposals.reduce((s, p) => s + (p.amount || 0), 0),
  };

  const formatDate = (d: Date | string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white flex items-center gap-3">
            <FileText className="w-8 h-8 text-gold" />
            Proposals
          </h1>
          <p className="text-warm-white/40 mt-1">
            Create, manage, and track all proposals
          </p>
        </div>
        <Link href="/admin/proposals/new">
          <Button variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Create Proposal
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <Card variant="glass" className="p-4 text-center">
          <p className="text-2xl font-bold text-warm-white">{stats.total}</p>
          <p className="text-xs text-warm-white/40">Total</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.draft}</p>
          <p className="text-xs text-warm-white/40">Draft</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <p className="text-2xl font-bold text-gold">{stats.sent}</p>
          <p className="text-xs text-warm-white/40">Sent</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.accepted}</p>
          <p className="text-xs text-warm-white/40">Accepted</p>
        </Card>
        <Card variant="glass" className="p-4 text-center">
          <p className="text-2xl font-bold text-gold">ETB {stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-warm-white/40">Total Value</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative">
          <select
            value={params.type || ""}
            className="px-4 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="">All Types</option>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={params.status || ""}
            className="px-4 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
        {(params.type || params.status) && (
          <Link
            href="/admin/proposals"
            className="inline-flex items-center px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white/60 text-sm hover:text-warm-white transition-colors"
          >
            Clear Filters
          </Link>
        )}
      </div>

      {proposals.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <FileText className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No proposals yet</p>
          <p className="text-warm-white/30 text-sm mb-6">
            Create your first proposal to start tracking opportunities.
          </p>
          <Link href="/admin/proposals/new">
            <Button variant="primary">
              <Plus className="w-4 h-4" />
              Create Proposal
            </Button>
          </Link>
        </Card>
      ) : (
        <Card variant="bordered" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Title</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Recipient</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-warm-white/40 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {proposals.map((p) => {
                  const type = TYPE_CONFIG[p.type] || TYPE_CONFIG.custom;
                  const status = STATUS_CONFIG[p.status] || STATUS_CONFIG.draft;
                  const authorName = p.author
                    ? `${p.author.firstName || ""} ${p.author.lastName || ""}`.trim()
                    : null;
                  return (
                    <tr key={p.id} className="hover:bg-surface-light/50 transition-colors">
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/proposals/${p.id}`}
                          className="font-medium text-warm-white hover:text-gold transition-colors"
                        >
                          {p.title}
                        </Link>
                        {p.subject && (
                          <p className="text-xs text-warm-white/30 mt-0.5 line-clamp-1">{p.subject}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={type.variant} size="sm">{type.label}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-warm-white/70">{p.recipientName || "—"}</p>
                        {p.recipientOrg && (
                          <p className="text-xs text-warm-white/30">{p.recipientOrg}</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {p.amount ? (
                          <span className="font-medium text-gold">ETB {p.amount.toLocaleString()}</span>
                        ) : (
                          <span className="text-warm-white/30">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={status.variant} size="sm">{status.label}</Badge>
                      </td>
                      <td className="px-5 py-4 text-xs text-warm-white/40">{formatDate(p.createdAt)}</td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/proposals/${p.id}`}
                          className="text-xs text-gold hover:text-gold-light transition-colors"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
