import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building2,
  Users,
  FileText,
  MessageSquare,
  Banknote,
  ExternalLink,
  Calendar,
  Clock,
  Plus,
} from "lucide-react";

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

const DOC_STATUS: Record<string, string> = {
  draft: "Draft",
  pending_review: "Pending Review",
  approved: "Approved",
  signed: "Signed",
  expired: "Expired",
};

const FUNDING_STATUS: Record<string, string> = {
  identified: "Identified",
  applied: "Applied",
  approved: "Approved",
  rejected: "Rejected",
  received: "Received",
};

const COMM_TYPE: Record<string, string> = {
  email: "Email",
  phone: "Phone Call",
  meeting: "Meeting",
  note: "Note",
  follow_up: "Follow-up",
};

export const dynamic = "force-dynamic";

export default async function PartnershipDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const tab = sp.tab || "overview";

  const partnership = await db.partnership.findUnique({
    where: { id },
    include: {
      contacts: { orderBy: { isPrimary: "desc" } },
      agreements: { orderBy: { createdAt: "desc" } },
      communications: { orderBy: { createdAt: "desc" } },
      fundingOpps: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!partnership) notFound();

  const status = STATUS_CONFIG[partnership.status] || STATUS_CONFIG.prospect;
  const formatDate = (d: Date | string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tabs = [
    { key: "overview", label: "Overview", icon: Building2 },
    { key: "contacts", label: "Contacts", icon: Users, count: partnership.contacts.length },
    { key: "agreements", label: "Agreements", icon: FileText, count: partnership.agreements.length },
    { key: "communications", label: "Communications", icon: MessageSquare, count: partnership.communications.length },
    { key: "funding", label: "Funding", icon: Banknote, count: partnership.fundingOpps.length },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <Link
        href="/admin/partnerships"
        className="inline-flex items-center gap-2 text-sm text-warm-white/40 hover:text-warm-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Partnerships
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
              {partnership.organizationName}
            </h1>
            <Badge variant={status.variant} size="md">{status.label}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="gold" size="sm">{CATEGORIES[partnership.category] || partnership.category}</Badge>
            {partnership.partnershipType && (
              <span className="text-sm text-warm-white/40 capitalize">{partnership.partnershipType}</span>
            )}
          </div>
        </div>
        {partnership.totalValue > 0 && (
          <Card variant="glass" className="px-5 py-3 text-center">
            <p className="text-xs text-warm-white/40">Total Value</p>
            <p className="text-xl font-bold text-gold">ETB {partnership.totalValue.toLocaleString()}</p>
          </Card>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={`/admin/partnerships/${id}?tab=${t.key}`}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              tab === t.key
                ? "bg-gold/10 border border-gold/30 text-gold"
                : "bg-surface-light border border-border text-warm-white/50 hover:text-warm-white"
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
            {t.count !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/5 text-[10px] font-bold">
                {t.count}
              </span>
            )}
          </Link>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card variant="bordered" className="p-6">
              <h3 className="text-sm font-medium text-warm-white/60 mb-4">Organization Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {partnership.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-warm-white/30 shrink-0" />
                    <a
                      href={partnership.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gold hover:underline flex items-center gap-1"
                    >
                      {partnership.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
                {partnership.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-warm-white/30 shrink-0" />
                    <span className="text-sm text-warm-white/70">{partnership.email}</span>
                  </div>
                )}
                {partnership.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-warm-white/30 shrink-0" />
                    <span className="text-sm text-warm-white/70">{partnership.phone}</span>
                  </div>
                )}
                {(partnership.address || partnership.city) && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-warm-white/30 shrink-0" />
                    <span className="text-sm text-warm-white/70">
                      {[partnership.address, partnership.city, partnership.country].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
              {partnership.description && (
                <p className="mt-4 text-sm text-warm-white/60 leading-relaxed">{partnership.description}</p>
              )}
            </Card>

            {partnership.agreements.length > 0 && (
              <Card variant="bordered" className="p-6">
                <h3 className="text-sm font-medium text-warm-white/60 mb-4">Active Agreements</h3>
                <div className="space-y-3">
                  {partnership.agreements.slice(0, 3).map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-light">
                      <div>
                        <p className="text-sm font-medium text-warm-white">{doc.title}</p>
                        <p className="text-xs text-warm-white/40 capitalize">{doc.type} &middot; {DOC_STATUS[doc.status] || doc.status}</p>
                      </div>
                      <Badge variant={doc.status === "signed" ? "default" : "gold"} size="sm">
                        {DOC_STATUS[doc.status] || doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card variant="bordered" className="p-6">
              <h3 className="text-sm font-medium text-warm-white/60 mb-4">Primary Contact</h3>
              {partnership.primaryContactName ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-warm-white">{partnership.primaryContactName}</p>
                  {partnership.primaryContactPosition && (
                    <p className="text-xs text-warm-white/40">{partnership.primaryContactPosition}</p>
                  )}
                  {partnership.primaryContactEmail && (
                    <p className="text-xs text-gold">{partnership.primaryContactEmail}</p>
                  )}
                  {partnership.primaryContactPhone && (
                    <p className="text-xs text-warm-white/50">{partnership.primaryContactPhone}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-warm-white/30">No primary contact set</p>
              )}
            </Card>

            <Card variant="bordered" className="p-6">
              <h3 className="text-sm font-medium text-warm-white/60 mb-4">Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-white/40">Contacts</span>
                  <span className="text-warm-white">{partnership.contacts.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-white/40">Agreements</span>
                  <span className="text-warm-white">{partnership.agreements.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-white/40">Communications</span>
                  <span className="text-warm-white">{partnership.communications.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-white/40">Funding Opps</span>
                  <span className="text-warm-white">{partnership.fundingOpps.length}</span>
                </div>
                <div className="pt-3 border-t border-border flex justify-between text-sm">
                  <span className="text-warm-white/40">Created</span>
                  <span className="text-warm-white/60">{formatDate(partnership.createdAt)}</span>
                </div>
              </div>
            </Card>

            {partnership.notes && (
              <Card variant="bordered" className="p-6">
                <h3 className="text-sm font-medium text-warm-white/60 mb-2">Notes</h3>
                <p className="text-sm text-warm-white/50 leading-relaxed whitespace-pre-wrap">{partnership.notes}</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {tab === "contacts" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-warm-white">Contacts ({partnership.contacts.length})</h2>
          </div>
          {partnership.contacts.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <Users className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40">No contacts yet</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {partnership.contacts.map((c) => (
                <Card key={c.id} variant="bordered" className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-warm-white">{c.name}</h3>
                    {c.isPrimary && <Badge variant="gold" size="sm">Primary</Badge>}
                  </div>
                  {c.position && <p className="text-xs text-warm-white/50 mb-2">{c.position}</p>}
                  {c.department && <p className="text-xs text-warm-white/40 mb-2">{c.department}</p>}
                  <div className="space-y-1">
                    {c.email && (
                      <div className="flex items-center gap-2 text-xs text-warm-white/40">
                        <Mail className="w-3 h-3" />
                        {c.email}
                      </div>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-2 text-xs text-warm-white/40">
                        <Phone className="w-3 h-3" />
                        {c.phone}
                      </div>
                    )}
                  </div>
                  {c.notes && (
                    <p className="mt-2 pt-2 border-t border-border text-xs text-warm-white/30">{c.notes}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "agreements" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-warm-white">Agreements & Documents ({partnership.agreements.length})</h2>
          </div>
          {partnership.agreements.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <FileText className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40">No agreements yet</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {partnership.agreements.map((doc) => (
                <Card key={doc.id} variant="bordered" className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-medium text-warm-white">{doc.title}</h3>
                        <Badge variant="outline" size="sm">{doc.type.toUpperCase()}</Badge>
                        <Badge variant={doc.status === "signed" ? "default" : doc.status === "expired" ? "red" : "gold"} size="sm">
                          {DOC_STATUS[doc.status] || doc.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-warm-white/40 mt-1">
                        {doc.effectiveDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Effective: {formatDate(doc.effectiveDate)}
                          </span>
                        )}
                        {doc.expirationDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires: {formatDate(doc.expirationDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs hover:bg-gold/20 transition-colors"
                      >
                        View File
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {doc.notes && (
                    <p className="mt-3 pt-3 border-t border-border text-xs text-warm-white/40">{doc.notes}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "communications" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-warm-white">Communications ({partnership.communications.length})</h2>
          </div>
          {partnership.communications.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <MessageSquare className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40">No communications logged yet</p>
            </Card>
          ) : (
            <div className="relative ml-4 border-l-2 border-border pl-8 space-y-6">
              {partnership.communications.map((c) => (
                <div key={c.id} className="relative">
                  <div className="absolute -left-[41px] w-4 h-4 rounded-full bg-surface-light border-2 border-gold" />
                  <Card variant="bordered" className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="glass" size="sm">{COMM_TYPE[c.type] || c.type}</Badge>
                      <Badge variant={c.direction === "inbound" ? "gold" : "default"} size="sm">
                        {c.direction === "inbound" ? "Inbound" : "Outbound"}
                      </Badge>
                      <span className="text-xs text-warm-white/30">{formatDate(c.createdAt)}</span>
                    </div>
                    {c.subject && (
                      <p className="text-sm font-medium text-warm-white mb-1">{c.subject}</p>
                    )}
                    <p className="text-sm text-warm-white/60">{c.content}</p>
                    {(c.contactName || c.contactEmail) && (
                      <p className="mt-2 text-xs text-warm-white/30">
                        {c.contactName}
                        {c.contactEmail && ` (${c.contactEmail})`}
                      </p>
                    )}
                    {c.followUpDate && !c.completed && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                        <Clock className="w-3 h-3" />
                        Follow-up: {formatDate(c.followUpDate)}
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "funding" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-warm-white">Funding Opportunities ({partnership.fundingOpps.length})</h2>
          </div>
          {partnership.fundingOpps.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <Banknote className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40">No funding opportunities yet</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {partnership.fundingOpps.map((f) => (
                <Card key={f.id} variant="bordered" className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-warm-white">{f.title}</h3>
                    <Badge
                      variant={f.status === "approved" || f.status === "received" ? "default" : f.status === "rejected" ? "red" : "gold"}
                      size="sm"
                    >
                      {FUNDING_STATUS[f.status] || f.status}
                    </Badge>
                  </div>
                  {f.source && <p className="text-xs text-warm-white/50 mb-2">Source: {f.source}</p>}
                  {f.amount && (
                    <p className="text-lg font-bold text-gold mb-2">
                      {f.currency} {f.amount.toLocaleString()}
                    </p>
                  )}
                  {f.deadline && (
                    <p className="text-xs text-warm-white/40 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Deadline: {formatDate(f.deadline)}
                    </p>
                  )}
                  {f.description && (
                    <p className="mt-2 text-xs text-warm-white/40 line-clamp-3">{f.description}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
