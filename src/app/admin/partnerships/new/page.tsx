"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Handshake,
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Users,
  FileText,
  Loader2,
} from "lucide-react";

const CATEGORIES = [
  { value: "government", label: "Government" },
  { value: "ngo", label: "NGO" },
  { value: "embassy", label: "Embassy" },
  { value: "university", label: "University" },
  { value: "hotel", label: "Hotel" },
  { value: "resort", label: "Resort" },
  { value: "corporate", label: "Corporate" },
  { value: "media", label: "Media" },
  { value: "tv_station", label: "TV Station" },
  { value: "radio", label: "Radio" },
  { value: "production", label: "Production" },
  { value: "wedding_planner", label: "Wedding Planner" },
  { value: "event_organizer", label: "Event Organizer" },
  { value: "youth", label: "Youth" },
  { value: "international", label: "International" },
  { value: "church", label: "Church" },
  { value: "community", label: "Community" },
];

const PARTNERSHIP_TYPES = [
  { value: "sponsorship", label: "Sponsorship" },
  { value: "venue", label: "Venue" },
  { value: "media", label: "Media" },
  { value: "technology", label: "Technology" },
  { value: "training", label: "Training" },
  { value: "funding", label: "Funding" },
];

const STEPS = [
  { label: "Organization Info", icon: Building2 },
  { label: "Contacts & Department", icon: Users },
  { label: "Partnership Details", icon: FileText },
];

interface FormData {
  organizationName: string;
  category: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  primaryContactPosition: string;
  department: string;
  partnershipType: string;
  description: string;
  totalValue: string;
  status: string;
  notes: string;
  tags: string;
}

const initialData: FormData = {
  organizationName: "",
  category: "corporate",
  website: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "Ethiopia",
  primaryContactName: "",
  primaryContactEmail: "",
  primaryContactPhone: "",
  primaryContactPosition: "",
  department: "",
  partnershipType: "",
  description: "",
  totalValue: "",
  status: "prospect",
  notes: "",
  tags: "",
};

export default function NewPartnershipPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const update = (field: keyof FormData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    if (!data.organizationName.trim()) {
      setError("Organization name is required");
      setStep(0);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        ...data,
        totalValue: data.totalValue ? Number(data.totalValue) : 0,
        tags: data.tags
          ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
      };

      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create partnership");
      }

      router.push("/admin/partnerships");
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
          href="/admin/partnerships"
          className="inline-flex items-center gap-2 text-sm text-warm-white/40 hover:text-warm-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Partnerships
        </Link>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white flex items-center gap-3">
          <Handshake className="w-8 h-8 text-gold" />
          New Partnership
        </h1>
      </div>

      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                i === step
                  ? "bg-gold/10 border border-gold/30 text-gold"
                  : i < step
                  ? "bg-surface-light border border-border text-warm-white/60"
                  : "bg-surface-light border border-border text-warm-white/30"
              }`}
            >
              <s.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{s.label}</span>
              {i < step && <Check className="w-3 h-3 text-emerald-400" />}
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? "bg-gold/30" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
          {error}
        </div>
      )}

      <Card variant="bordered" className="p-6">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Organization Information</h2>
            <Input
              label="Organization Name *"
              placeholder="e.g. Addis Ababa Culture Bureau"
              value={data.organizationName}
              onChange={(e) => update("organizationName", e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Category *</label>
              <select
                value={data.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <Input
              label="Website"
              placeholder="https://example.com"
              value={data.website}
              onChange={(e) => update("website", e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="contact@org.com"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
              />
              <Input
                label="Phone"
                placeholder="+251 911 000 000"
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
            <Input
              label="Address"
              placeholder="Street address"
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="Addis Ababa"
                value={data.city}
                onChange={(e) => update("city", e.target.value)}
              />
              <Input
                label="Country"
                placeholder="Ethiopia"
                value={data.country}
                onChange={(e) => update("country", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Contacts & Department</h2>
            <Input
              label="Primary Contact Name"
              placeholder="Full name"
              value={data.primaryContactName}
              onChange={(e) => update("primaryContactName", e.target.value)}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Contact Email"
                type="email"
                placeholder="name@org.com"
                value={data.primaryContactEmail}
                onChange={(e) => update("primaryContactEmail", e.target.value)}
              />
              <Input
                label="Contact Phone"
                placeholder="+251 911 000 000"
                value={data.primaryContactPhone}
                onChange={(e) => update("primaryContactPhone", e.target.value)}
              />
            </div>
            <Input
              label="Contact Position"
              placeholder="e.g. Director of Partnerships"
              value={data.primaryContactPosition}
              onChange={(e) => update("primaryContactPosition", e.target.value)}
            />
            <Input
              label="Department"
              placeholder="e.g. International Relations"
              value={data.department}
              onChange={(e) => update("department", e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Partnership Type</label>
              <select
                value={data.partnershipType}
                onChange={(e) => update("partnershipType", e.target.value)}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
              >
                <option value="">Select type</option>
                {PARTNERSHIP_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Partnership Details</h2>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Description</label>
              <textarea
                rows={4}
                placeholder="Describe the partnership opportunity..."
                value={data.description}
                onChange={(e) => update("description", e.target.value)}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white placeholder:text-warm-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Total Value (ETB)"
                type="number"
                placeholder="0"
                value={data.totalValue}
                onChange={(e) => update("totalValue", e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-warm-white/80 mb-2">Status</label>
                <select
                  value={data.status}
                  onChange={(e) => update("status", e.target.value)}
                  className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  <option value="prospect">Prospect</option>
                  <option value="contacted">Contacted</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Notes</label>
              <textarea
                rows={3}
                placeholder="Internal notes..."
                value={data.notes}
                onChange={(e) => update("notes", e.target.value)}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white placeholder:text-warm-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
              />
            </div>
            <Input
              label="Tags (comma-separated)"
              placeholder="e.g. arts, culture, funding"
              value={data.tags}
              onChange={(e) => update("tags", e.target.value)}
            />
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          {step < STEPS.length - 1 ? (
            <Button variant="primary" onClick={() => setStep(step + 1)}>
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Create Partnership
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
