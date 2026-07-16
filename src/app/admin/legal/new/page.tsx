"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, FileText, Calendar, Save, Upload, X, File,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categoryOptions = [
  { value: "business_registration", label: "Business Registration" },
  { value: "tax_finance", label: "Tax & Finance" },
  { value: "entertainment", label: "Entertainment & Operations" },
  { value: "hr_employment", label: "HR & Employment" },
  { value: "sponsorship_partnership", label: "Sponsorship & Partnerships" },
];

const subcategoryOptions: Record<string, { value: string; label: string }[]> = {
  business_registration: [
    { value: "business_license", label: "Business License" },
    { value: "trade_license", label: "Trade License" },
    { value: "commercial_register", label: "Commercial Register" },
    { value: "partnership_agreement", label: "Partnership Agreement" },
  ],
  tax_finance: [
    { value: "tin_certificate", label: "TIN Certificate" },
    { value: "vat_registration", label: "VAT Registration" },
    { value: "tax_clearance", label: "Tax Clearance" },
    { value: "audit_report", label: "Audit Report" },
    { value: "financial_statement", label: "Financial Statement" },
  ],
  entertainment: [
    { value: "performance_license", label: "Performance License" },
    { value: "copyright", label: "Copyright" },
    { value: "trademark", label: "Trademark" },
    { value: "event_permit", label: "Event Permit" },
    { value: "music_license", label: "Music License" },
    { value: "broadcast_license", label: "Broadcast License" },
  ],
  hr_employment: [
    { value: "employment_contract", label: "Employment Contract" },
    { value: "nda", label: "NDA" },
    { value: "non_compete", label: "Non-Compete" },
    { value: "policy_document", label: "Policy Document" },
    { value: "handbook", label: "Handbook" },
    { value: "benefits_plan", label: "Benefits Plan" },
  ],
  sponsorship_partnership: [
    { value: "sponsorship_agreement", label: "Sponsorship Agreement" },
    { value: "mou", label: "MOU" },
    { value: "partnership_contract", label: "Partnership Contract" },
    { value: "brand_guidelines", label: "Brand Guidelines" },
    { value: "co_branding", label: "Co-Branding" },
  ],
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
  { value: "expiring_soon", label: "Expiring Soon" },
  { value: "pending_renewal", label: "Pending Renewal" },
  { value: "archived", label: "Archived" },
];

const approvalOptions = [
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function NewLegalDocumentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFileSize, setUploadedFileSize] = useState(0);
  const [issueDate, setIssueDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [status, setStatus] = useState("active");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("approved");

  const availableSubcategories = category ? subcategoryOptions[category] || [] : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !subcategory) {
      setError("Title, category, and subcategory are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let url = fileUrl;
      if (selectedFile && !fileUrl) {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("folder", "legal");
        const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
        if (!uploadRes.ok) throw new Error("File upload failed");
        const uploadData = await uploadRes.json();
        url = uploadData.url;
      }

      const res = await fetch("/api/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          subcategory,
          description: description || null,
          fileUrl: url || null,
          fileName: uploadedFileName || selectedFile?.name || null,
          fileSize: uploadedFileSize || selectedFile?.size || null,
          issueDate: issueDate || null,
          expirationDate: expirationDate || null,
          issuingAuthority: issuingAuthority || null,
          documentNumber: documentNumber || null,
          status,
          tags: tags
            ? tags.split(",").map((t) => t.trim()).filter(Boolean)
            : null,
          notes: notes || null,
          approvalStatus,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create document");
      }

      router.push("/admin/legal");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/legal"
          className="p-2 rounded-lg hover:bg-surface-light transition-colors text-warm-white/60 hover:text-warm-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Add Legal Document
          </h1>
          <p className="text-warm-white/40 mt-1">
            Register a new compliance document
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gold" />
            Document Information
          </h2>
          <div className="space-y-4">
            <Input
              label="Document Title"
              placeholder="e.g. Business License 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSubcategory("");
                    }}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Subcategory
                </label>
                <div className="relative">
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    disabled={!category}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select subcategory</option>
                    {availableSubcategories.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-warm-white/80 mb-2">
                Description
              </label>
              <textarea
                placeholder="Brief description of this document..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
              />
            </div>

            {selectedFile ? (
              <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-light border border-border">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <File className="w-6 h-6 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-warm-white truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-warm-white/40 mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB &middot; {selectedFile.type}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setFileUrl(""); }}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-warm-white/40 hover:text-warm-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer border-border hover:border-gold/30 hover:bg-surface-light transition-all"
              >
                <Upload className="w-8 h-8 text-warm-white/20 mx-auto mb-2" />
                <p className="text-sm text-warm-white/60">
                  Drag & drop or <span className="text-gold font-medium">browse</span> to upload a file
                </p>
                <p className="text-xs text-warm-white/30 mt-1">
                  PDF, DOC, DOCX, images up to 50MB
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                  setUploadedFileName(file.name);
                  setUploadedFileSize(file.size);
                }
                e.target.value = "";
              }}
            />
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gold" />
            Dates & Authority
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Issue Date"
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
              <Input
                label="Expiration Date"
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Issuing Authority"
                placeholder="e.g. Ministry of Trade"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
              />
              <Input
                label="Document Number"
                placeholder="e.g. BL-2024-001"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4">
            Status & Approval
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Document Status
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Approval Status
                </label>
                <div className="relative">
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    {approvalOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <Input
              label="Tags (comma separated)"
              placeholder="e.g. compliance, annual, critical"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-warm-white/80 mb-2">
                Notes
              </label>
              <textarea
                placeholder="Additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin/legal">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Document
          </Button>
        </div>
      </form>
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
