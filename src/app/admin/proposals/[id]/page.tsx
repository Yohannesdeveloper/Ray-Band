import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  PenLine,
  Download,
  Mail,
  Building2,
  Calendar,
  User,
} from "lucide-react";

const TYPE_CONFIG: Record<string, string> = {
  company_profile: "Company Profile",
  capability_statement: "Capability Statement",
  sponsorship: "Sponsorship",
  partnership: "Partnership",
  government: "Government",
  ngo: "NGO",
  corporate: "Corporate",
  festival: "Festival",
  wedding: "Wedding",
  event: "Event",
  grant: "Grant",
  investment: "Investment",
  funding: "Funding",
  custom: "Custom",
};

const TYPE_BADGE: Record<string, "default" | "gold" | "red" | "outline" | "glass"> = {
  company_profile: "outline",
  capability_statement: "outline",
  sponsorship: "gold",
  partnership: "gold",
  government: "glass",
  ngo: "glass",
  corporate: "default",
  festival: "gold",
  wedding: "glass",
  event: "glass",
  grant: "gold",
  investment: "gold",
  funding: "gold",
  custom: "outline",
};

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "gold" | "red" | "outline" | "glass"; color: string }> = {
  draft: { label: "Draft", variant: "outline", color: "text-warm-white/50" },
  review: { label: "Under Review", variant: "glass", color: "text-amber-400" },
  sent: { label: "Sent", variant: "gold", color: "text-gold" },
  accepted: { label: "Accepted", variant: "default", color: "text-emerald-400" },
  rejected: { label: "Rejected", variant: "red", color: "text-deep-red-light" },
  expired: { label: "Expired", variant: "red", color: "text-deep-red-light" },
};

export const dynamic = "force-dynamic";

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const proposal = await db.proposal.findUnique({
    where: { id },
    include: {
      author: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  if (!proposal) notFound();

  const status = STATUS_CONFIG[proposal.status] || STATUS_CONFIG.draft;
  const typeName = TYPE_CONFIG[proposal.type] || proposal.type;
  const typeBadge = TYPE_BADGE[proposal.type] || "outline";

  const formatDate = (d: Date | string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const authorName = proposal.author
    ? `${proposal.author.firstName || ""} ${proposal.author.lastName || ""}`.trim()
    : null;

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        href="/admin/proposals"
        className="inline-flex items-center gap-2 text-sm text-warm-white/40 hover:text-warm-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Proposals
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
              {proposal.title}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={typeBadge as "default" | "gold" | "red" | "outline" | "glass"} size="sm">{typeName}</Badge>
            <Badge variant={status.variant} size="sm">{status.label}</Badge>
            {proposal.amount && (
              <span className="text-sm font-medium text-gold">ETB {proposal.amount.toLocaleString()}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {proposal.executiveSummary && (
            <Card variant="bordered" className="p-6">
              <h3 className="text-sm font-medium text-warm-white/60 mb-3">Executive Summary</h3>
              <p className="text-sm text-warm-white/70 leading-relaxed whitespace-pre-wrap">
                {proposal.executiveSummary}
              </p>
            </Card>
          )}

          {proposal.content && (
            <Card variant="bordered" className="p-6">
              <h3 className="text-sm font-medium text-warm-white/60 mb-3">Proposal Content</h3>
              <div className="prose prose-invert prose-sm max-w-none">
                {proposal.content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-lg font-semibold text-warm-white mt-6 mb-3 first:mt-0">
                        {line.replace(/^##\s*/, "")}
                      </h2>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="text-base font-medium text-warm-white mt-4 mb-2">
                        {line.replace(/^###\s*/, "")}
                      </h3>
                    );
                  }
                  if (line.startsWith("- ") || line.startsWith("* ")) {
                    return (
                      <li key={i} className="text-sm text-warm-white/60 ml-4 mb-1 list-disc">
                        {line.replace(/^[-*]\s*/, "")}
                      </li>
                    );
                  }
                  if (line.trim() === "") {
                    return <br key={i} />;
                  }
                  return (
                    <p key={i} className="text-sm text-warm-white/60 mb-2 leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </Card>
          )}

          {!proposal.executiveSummary && !proposal.content && (
            <Card variant="glass" className="p-12 text-center">
              <FileText className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/40">No content has been added to this proposal yet</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card variant="bordered" className="p-6">
            <h3 className="text-sm font-medium text-warm-white/60 mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-warm-white/40 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <Badge variant={status.variant} size="md">{status.label}</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-warm-white/40 mb-1">Type</p>
                <Badge variant={typeBadge as "default" | "gold" | "red" | "outline" | "glass"} size="md">{typeName}</Badge>
              </div>
              {proposal.amount && (
                <div>
                  <p className="text-xs text-warm-white/40 mb-1">Amount</p>
                  <p className="text-lg font-bold text-gold">ETB {proposal.amount.toLocaleString()}</p>
                </div>
              )}
              {proposal.validUntil && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-warm-white/30" />
                  <div>
                    <p className="text-xs text-warm-white/40">Valid Until</p>
                    <p className="text-warm-white/70">{formatDate(proposal.validUntil)}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card variant="bordered" className="p-6">
            <h3 className="text-sm font-medium text-warm-white/60 mb-4">Recipient</h3>
            <div className="space-y-3">
              {proposal.recipientName ? (
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-warm-white/30" />
                  <div>
                    <p className="text-sm text-warm-white">{proposal.recipientName}</p>
                    {proposal.recipientOrg && (
                      <p className="text-xs text-warm-white/40">{proposal.recipientOrg}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-warm-white/30">No recipient set</p>
              )}
              {proposal.recipientEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-warm-white/30" />
                  <span className="text-sm text-warm-white/70">{proposal.recipientEmail}</span>
                </div>
              )}
              {proposal.recipientOrg && proposal.recipientName && (
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-warm-white/30" />
                  <span className="text-sm text-warm-white/70">{proposal.recipientOrg}</span>
                </div>
              )}
            </div>
          </Card>

          <Card variant="bordered" className="p-6">
            <h3 className="text-sm font-medium text-warm-white/60 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <PenLine className="w-4 h-4 text-warm-white/30" />
                <div>
                  <p className="text-xs text-warm-white/40">Created</p>
                  <p className="text-warm-white/70">{formatDate(proposal.createdAt)}</p>
                </div>
              </div>
              {proposal.sentAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Send className="w-4 h-4 text-gold" />
                  <div>
                    <p className="text-xs text-warm-white/40">Sent</p>
                    <p className="text-warm-white/70">{formatDate(proposal.sentAt)}</p>
                  </div>
                </div>
              )}
              {proposal.responseAt && (
                <div className="flex items-center gap-3 text-sm">
                  {proposal.status === "accepted" ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-deep-red-light" />
                  )}
                  <div>
                    <p className="text-xs text-warm-white/40">Response</p>
                    <p className="text-warm-white/70">{formatDate(proposal.responseAt)}</p>
                  </div>
                </div>
              )}
              {authorName && (
                <div className="flex items-center gap-3 text-sm pt-2 border-t border-border">
                  <User className="w-4 h-4 text-warm-white/30" />
                  <div>
                    <p className="text-xs text-warm-white/40">Author</p>
                    <p className="text-warm-white/70">{authorName}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="flex flex-col gap-2">
            {proposal.status === "draft" && (
              <form action={`/api/proposals/${proposal.id}`} method="PATCH">
                <input type="hidden" name="status" value="sent" />
                <Button variant="primary" size="sm" className="w-full" type="submit">
                  <Send className="w-4 h-4" />
                  Mark as Sent
                </Button>
              </form>
            )}
            {proposal.status === "sent" && (
              <>
                <form action={`/api/proposals/${proposal.id}`} method="PATCH">
                  <input type="hidden" name="status" value="accepted" />
                  <Button variant="primary" size="sm" className="w-full" type="submit">
                    <CheckCircle className="w-4 h-4" />
                    Mark Accepted
                  </Button>
                </form>
                <form action={`/api/proposals/${proposal.id}`} method="PATCH">
                  <input type="hidden" name="status" value="rejected" />
                  <Button variant="outline" size="sm" className="w-full" type="submit">
                    <XCircle className="w-4 h-4" />
                    Mark Rejected
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
