"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Filter, ChevronDown, FileText, Loader2, AlertCircle,
  Clock, Plus, Shield, AlertTriangle, Archive, CheckCircle,
  Calendar, Download,
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
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  business_registration: "Business Registration",
  tax_finance: "Tax & Finance",
  entertainment: "Entertainment & Operations",
  hr_employment: "HR & Employment",
  sponsorship_partnership: "Sponsorship & Partnerships",
};

const categoryTabs = [
  "All",
  "Business Registration",
  "Tax & Finance",
  "Entertainment & Operations",
  "HR & Employment",
  "Sponsorship & Partnerships",
];

const categoryValueMap: Record<string, string> = {
  "Business Registration": "business_registration",
  "Tax & Finance": "tax_finance",
  "Entertainment & Operations": "entertainment",
  "HR & Employment": "hr_employment",
  "Sponsorship & Partnerships": "sponsorship_partnership",
};

const statusConfig: Record<string, { label: string; variant: "default" | "gold" | "red" | "outline" | "glass"; icon: React.ReactNode }> = {
  active: { label: "Active", variant: "default", icon: <CheckCircle className="w-3 h-3" /> },
  expired: { label: "Expired", variant: "red", icon: <AlertCircle className="w-3 h-3" /> },
  expiring_soon: { label: "Expiring Soon", variant: "gold", icon: <AlertTriangle className="w-3 h-3" /> },
  pending_renewal: { label: "Pending Renewal", variant: "gold", icon: <Clock className="w-3 h-3" /> },
  archived: { label: "Archived", variant: "outline", icon: <Archive className="w-3 h-3" /> },
};

const subcategoryOptions: Record<string, string[]> = {
  business_registration: ["business_license", "trade_license", "commercial_register", "partnership_agreement"],
  tax_finance: ["tin_certificate", "vat_registration", "tax_clearance", "audit_report", "financial_statement"],
  entertainment: ["performance_license", "copyright", "trademark", "event_permit", "music_license", "broadcast_license"],
  hr_employment: ["employment_contract", "nda", "non_compete", "policy_document", "handbook", "benefits_plan"],
  sponsorship_partnership: ["sponsorship_agreement", "mou", "partnership_contract", "brand_guidelines", "co_branding"],
};

export default function AdminLegalPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [subcategoryFilter, setSubcategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("/api/legal");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setDocuments(data.documents || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const filtered = documents.filter((doc) => {
    const catValue = categoryValueMap[activeCategory];
    const matchesCategory = activeCategory === "All" || doc.category === catValue;
    const matchesSubcategory =
      subcategoryFilter === "All" || doc.subcategory === subcategoryFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.subcategory.toLowerCase().includes(q) ||
      doc.issuingAuthority?.toLowerCase().includes(q) ||
      doc.documentNumber?.toLowerCase().includes(q);
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const stats = {
    total: documents.length,
    active: documents.filter((d) => d.status === "active").length,
    expiringSoon: documents.filter((d) => d.status === "expiring_soon").length,
    expired: documents.filter((d) => d.status === "expired").length,
  };

  const formatDate = (d: string | null) => {
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

  const currentCatValue = categoryValueMap[activeCategory];
  const availableSubcategories =
    currentCatValue && subcategoryOptions[currentCatValue]
      ? subcategoryOptions[currentCatValue]
      : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
        <AlertCircle className="w-4 h-4 shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Legal & Compliance
          </h1>
          <p className="text-warm-white/40 mt-1">
            Document vault & compliance management
          </p>
        </div>
        <Link href="/admin/legal/new">
          <Button>
            <Plus className="w-4 h-4" />
            Add Document
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-warm-white">{stats.total}</p>
          <p className="text-xs text-warm-white/40">Total Documents</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
          <p className="text-xs text-warm-white/40">Active</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.expiringSoon}</p>
          <p className="text-xs text-warm-white/40">Expiring Soon</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-deep-red-light">{stats.expired}</p>
          <p className="text-xs text-warm-white/40">Expired</p>
        </Card>
      </div>

      <div className="relative flex-1 mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {categoryTabs.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSubcategoryFilter("All");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold text-charcoal"
                  : "bg-surface-light text-warm-white/60 hover:text-warm-white hover:bg-surface-lighter border border-border"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {activeCategory !== "All" && availableSubcategories.length > 0 && (
        <div className="relative mb-6">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <select
            value={subcategoryFilter}
            onChange={(e) => setSubcategoryFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="All">All Subcategories</option>
            {availableSubcategories.map((sub) => (
              <option key={sub} value={sub}>
                {sub
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
      )}

      {filtered.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Shield className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No documents found</p>
          <p className="text-warm-white/30 text-sm">
            Add legal documents to keep your compliance records organized.
          </p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => {
            const status = statusConfig[doc.status] || statusConfig.active;
            const daysLeft = getDaysUntilExpiration(doc.expirationDate);
            const isUrgent =
              doc.status === "expired" ||
              doc.status === "expiring_soon" ||
              (daysLeft !== null && daysLeft <= 30 && daysLeft > 0);

            return (
              <Link key={doc.id} href={`/admin/legal/${doc.id}`}>
                <Card
                  variant="hover"
                  className={`p-5 h-full ${
                    isUrgent && doc.status === "expired"
                      ? "border border-deep-red/30"
                      : isUrgent
                      ? "border border-amber-500/30"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-gold" />
                      </div>
                      <Badge variant="gold" size="sm">
                        {categoryLabels[doc.category] || doc.category}
                      </Badge>
                    </div>
                    <Badge variant={status.variant} size="sm">
                      <span className="flex items-center gap-1">
                        {status.icon}
                        {status.label}
                      </span>
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-warm-white mb-1 line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-warm-white/40 capitalize mb-3">
                    {doc.subcategory.replace(/_/g, " ")}
                  </p>

                  <div className="space-y-1.5 text-xs text-warm-white/50">
                    {doc.issueDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span>Issued: {formatDate(doc.issueDate)}</span>
                      </div>
                    )}
                    {doc.expirationDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span className={isUrgent ? "text-amber-400 font-medium" : ""}>
                          Expires: {formatDate(doc.expirationDate)}
                          {daysLeft !== null &&
                            daysLeft > 0 &&
                            ` (${daysLeft} days)`}
                          {daysLeft !== null && daysLeft <= 0 && " (EXPIRED)"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 shrink-0" />
                      <span>v{doc.version}</span>
                      {doc.documentNumber && (
                        <span className="text-warm-white/30">
                          · {doc.documentNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  {doc.fileUrl && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-gold/70">
                        <Download className="w-3 h-3" />
                        <span>Download available</span>
                      </div>
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
