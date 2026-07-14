"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";

const PROPOSAL_TYPES = [
  { value: "sponsorship", label: "Sponsorship" },
  { value: "partnership", label: "Partnership" },
  { value: "government", label: "Government" },
  { value: "ngo", label: "NGO" },
  { value: "corporate", label: "Corporate" },
  { value: "festival", label: "Festival" },
  { value: "wedding", label: "Wedding" },
  { value: "event", label: "Event" },
  { value: "grant", label: "Grant" },
  { value: "investment", label: "Investment" },
  { value: "funding", label: "Funding" },
  { value: "company_profile", label: "Company Profile" },
  { value: "capability_statement", label: "Capability Statement" },
  { value: "custom", label: "Custom" },
];

interface FormData {
  title: string;
  type: string;
  recipientName: string;
  recipientEmail: string;
  recipientOrg: string;
  subject: string;
  executiveSummary: string;
  content: string;
  amount: string;
  validUntil: string;
}

const initialData: FormData = {
  title: "",
  type: "sponsorship",
  recipientName: "",
  recipientEmail: "",
  recipientOrg: "",
  subject: "",
  executiveSummary: "",
  content: "",
  amount: "",
  validUntil: "",
};

export default function NewProposalPage() {
  const router = useRouter();
  const [data, setData] = useState<FormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!data.title.trim()) {
      setError("Title is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          amount: data.amount ? Number(data.amount) : null,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create proposal");
      }

      router.push("/admin/proposals");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin/proposals"
          className="inline-flex items-center gap-2 text-sm text-warm-white/40 hover:text-warm-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Proposals
        </Link>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white flex items-center gap-3">
          <FileText className="w-8 h-8 text-gold" />
          Create Proposal
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
          {error}
        </div>
      )}

      <Card variant="bordered" className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-warm-white/80 mb-2">Proposal Type *</label>
          <select
            value={data.type}
            onChange={(e) => update("type", e.target.value)}
            className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            {PROPOSAL_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>

        <Input
          label="Title *"
          placeholder="e.g. Sponsorship Proposal for Sound of Unity Festival 2026"
          value={data.title}
          onChange={(e) => update("title", e.target.value)}
        />

        <Input
          label="Subject"
          placeholder="Proposal subject line"
          value={data.subject}
          onChange={(e) => update("subject", e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Recipient Name"
            placeholder="Contact person name"
            value={data.recipientName}
            onChange={(e) => update("recipientName", e.target.value)}
          />
          <Input
            label="Recipient Organization"
            placeholder="Company or organization"
            value={data.recipientOrg}
            onChange={(e) => update("recipientOrg", e.target.value)}
          />
        </div>

        <Input
          label="Recipient Email"
          type="email"
          placeholder="recipient@company.com"
          value={data.recipientEmail}
          onChange={(e) => update("recipientEmail", e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-warm-white/80 mb-2">Executive Summary</label>
          <textarea
            rows={4}
            placeholder="Brief summary of the proposal..."
            value={data.executiveSummary}
            onChange={(e) => update("executiveSummary", e.target.value)}
            className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white placeholder:text-warm-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-white/80 mb-2">Full Content (Markdown)</label>
          <textarea
            rows={12}
            placeholder={"## Proposal Details\n\nDescribe your proposal in detail...\n\n## Objectives\n\n- Objective 1\n- Objective 2\n\n## Budget\n\n..."}
            value={data.content}
            onChange={(e) => update("content", e.target.value)}
            className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white placeholder:text-warm-white/30 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Amount (ETB)"
            type="number"
            placeholder="0"
            value={data.amount}
            onChange={(e) => update("amount", e.target.value)}
          />
          <Input
            label="Valid Until"
            type="date"
            value={data.validUntil}
            onChange={(e) => update("validUntil", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Link href="/admin/proposals">
            <Button variant="ghost" type="button">Cancel</Button>
          </Link>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Create Proposal
          </Button>
        </div>
      </Card>
    </div>
  );
}
