"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, FileText, Calendar, Clock, Download,
  Edit, RefreshCw, Archive, CheckCircle, AlertCircle, AlertTriangle,
  Shield, Hash, Building, Tag, StickyNote,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LegalDocument {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  issueDate: string | null;
  expirationDate: string | null;
  issuingAuthority: string | null;
  documentNumber: string | null;
  status: string;
  tags: string | null;
  notes: string | null;
  version: number;
  approvalStatus: string;
  approvedBy: string | null;
  accessLogs: string | null;
  createdAt: string;
  updatedAt: string;
}

const categoryLabels: Record<string, string> = {
  business_registration: "Business Registration",
  tax_finance: "Tax & Finance",
  entertainment: "Entertainment & Operations",
  hr_employment: "HR & Employment",
  sponsorship_partnership: "Sponsorship & Partnerships",
};

const statusConfig: Record<string, { label: string; variant: "default" | "gold" | "red" | "outline" | "glass" }> = {
  active: { label: "Active", variant: "default" },
  expired: { label: "Expired", variant: "red" },
  expiring_soon: { label: "Expiring Soon", variant: "gold" },
  pending_renewal: { label: "Pending Renewal", variant: "gold" },
  archived: { label: "Archived", variant: "outline" },
};

const approvalConfig: Record<string, { label: string; variant: "default" | "gold" | "red" | "outline" | "glass" }> = {
  draft: { label: "Draft", variant: "outline" },
  pending_review: { label: "Pending Review", variant: "gold" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "red" },
};

export default function LegalDocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      const res = await fetch(`/api/legal/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setDocument(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load document");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntilExpiration = (d: string | null): number | null => {
    if (!d) return null;
    const exp = new Date(d);
    const now = new Date();
    return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleRenew = async () => {
    if (!document) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/legal/${document.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "active",
          version: document.version + 1,
          approvalStatus: "pending_review",
        }),
      });
      if (!res.ok) throw new Error("Failed to renew");
      await fetchDocument();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to renew");
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!document) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/legal/${document.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "archived" }),
      });
      if (!res.ok) throw new Error("Failed to archive");
      await fetchDocument();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to archive");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!document) return;
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/legal/${document.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/legal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
      setActionLoading(false);
    }
  };

  const parseJsonArray = (val: string | null): string[] => {
    if (!val) return [];
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (error && !document) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
        <AlertCircle className="w-4 h-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (!document) return null;

  const status = statusConfig[document.status] || statusConfig.active;
  const approval = approvalConfig[document.approvalStatus] || approvalConfig.draft;
  const daysLeft = getDaysUntilExpiration(document.expirationDate);
  const tags = parseJsonArray(document.tags);
  const isUrgent =
    document.status === "expired" ||
    document.status === "expiring_soon" ||
    (daysLeft !== null && daysLeft <= 30 && daysLeft > 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/legal"
          className="p-2 rounded-lg hover:bg-surface-light transition-colors text-warm-white/60 hover:text-warm-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
              {document.title}
            </h1>
            <Badge variant={status.variant} size="sm">{status.label}</Badge>
            <Badge variant={approval.variant} size="sm">{approval.label}</Badge>
          </div>
          <p className="text-warm-white/40 mt-1">
            {categoryLabels[document.category] || document.category} · v{document.version}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/admin/legal/${document.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRenew}
            disabled={actionLoading}
          >
            <RefreshCw className="w-4 h-4" />
            Renew
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleArchive}
            disabled={actionLoading}
          >
            <Archive className="w-4 h-4" />
            Archive
          </Button>
          {document.fileUrl && (
            <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm">
                <Download className="w-4 h-4" />
                Download
              </Button>
            </a>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gold" />
              Document Details
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-warm-white/40 mb-1">Subcategory</p>
                  <p className="text-sm text-warm-white capitalize">
                    {document.subcategory.replace(/_/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-warm-white/40 mb-1">Document Number</p>
                  <p className="text-sm text-warm-white flex items-center gap-1.5">
                    <Hash className="w-3 h-3 text-warm-white/30" />
                    {document.documentNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-warm-white/40 mb-1">Issuing Authority</p>
                  <p className="text-sm text-warm-white flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-warm-white/30" />
                    {document.issuingAuthority || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-warm-white/40 mb-1">Version</p>
                  <p className="text-sm text-warm-white">v{document.version}</p>
                </div>
              </div>
              {document.description && (
                <div>
                  <p className="text-xs text-warm-white/40 mb-1">Description</p>
                  <p className="text-sm text-warm-white/80">{document.description}</p>
                </div>
              )}
              {tags.length > 0 && (
                <div>
                  <p className="text-xs text-warm-white/40 mb-2 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {document.notes && (
                <div>
                  <p className="text-xs text-warm-white/40 mb-1 flex items-center gap-1">
                    <StickyNote className="w-3 h-3" />
                    Notes
                  </p>
                  <p className="text-sm text-warm-white/70 whitespace-pre-wrap">
                    {document.notes}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {document.accessLogs && (
            <Card variant="glass" className="p-6">
              <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold" />
                Version History
              </h2>
              <div className="space-y-3">
                {(() => {
                  try {
                    const logs = JSON.parse(document.accessLogs);
                    return logs.map((log: { userId?: string; action: string; timestamp: string }, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-gold/40 shrink-0" />
                        <span className="text-warm-white/80">{log.action}</span>
                        <span className="text-warm-white/40 text-xs ml-auto">
                          {formatShortDate(log.timestamp)}
                        </span>
                      </div>
                    ));
                  } catch {
                    return (
                      <p className="text-sm text-warm-white/40">No version history available</p>
                    );
                  }
                })()}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {document.expirationDate && (
            <Card
              variant="glass"
              className={`p-6 ${
                isUrgent && document.status === "expired"
                  ? "border border-deep-red/30"
                  : isUrgent
                  ? "border border-amber-500/30"
                  : ""
              }`}
            >
              <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold" />
                Expiration
              </h2>
              {isUrgent && daysLeft !== null && (
                <div
                  className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
                    document.status === "expired"
                      ? "bg-deep-red/10 text-deep-red-light border border-deep-red/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {document.status === "expired" ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  {document.status === "expired"
                    ? `Expired ${Math.abs(daysLeft)} days ago`
                    : `Expires in ${daysLeft} days`}
                </div>
              )}
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-warm-white/40">Issue Date</span>
                  <span className="text-warm-white">{formatDate(document.issueDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warm-white/40">Expiration Date</span>
                  <span className={`${isUrgent ? "text-amber-400 font-medium" : "text-warm-white"}`}>
                    {formatDate(document.expirationDate)}
                  </span>
                </div>
                {daysLeft !== null && (
                  <div className="flex justify-between">
                    <span className="text-warm-white/40">Time Remaining</span>
                    <span className={`${isUrgent ? "text-amber-400" : "text-warm-white"}`}>
                      {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                    </span>
                  </div>
                )}
                <div className="pt-3 border-t border-border">
                  {daysLeft !== null && daysLeft > 0 && (
                    <div className="w-full bg-surface rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          daysLeft > 90
                            ? "bg-emerald-400"
                            : daysLeft > 30
                            ? "bg-amber-400"
                            : "bg-deep-red-light"
                        }`}
                        style={{
                          width: `${Math.min(100, Math.max(5, (daysLeft / 365) * 100))}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-white/40">Created</span>
                <span className="text-warm-white">{formatShortDate(document.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-white/40">Last Updated</span>
                <span className="text-warm-white">{formatShortDate(document.updatedAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-white/40">Approved By</span>
                <span className="text-warm-white">{document.approvedBy || "—"}</span>
              </div>
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Danger Zone</h2>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-deep-red/30 text-deep-red-light hover:bg-deep-red/10"
              onClick={handleDelete}
              disabled={actionLoading}
            >
              Delete Document
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
