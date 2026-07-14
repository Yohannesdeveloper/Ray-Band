"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  Loader2,
  Save,
  Users,
  TrendingUp,
  Share2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const industries = [
  "Telecommunications",
  "Banking & Finance",
  "Manufacturing",
  "FMCG",
  "Beverages",
  "Energy & Mining",
  "Real Estate",
  "Aviation",
  "Media & Entertainment",
  "Technology",
  "Healthcare",
  "Education",
  "Hospitality",
  "Agriculture",
  "Retail",
  "Automotive",
  "Insurance",
  "Consulting",
  "Other",
];

const currencies = ["ETB", "USD", "EUR", "GBP"];

const statusOptions = [
  { value: "prospect", label: "Prospect" },
  { value: "initial_contact", label: "Initial Contact" },
  { value: "discovery_meeting", label: "Discovery Meeting" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "negotiation", label: "Negotiation" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "active", label: "Active" },
  { value: "renewed", label: "Renewed" },
  { value: "closed", label: "Closed" },
];

const inputClass =
  "w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50";
const labelClass = "block text-xs font-medium text-warm-white/50 mb-1.5";
const selectClass =
  "w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer appearance-none";

interface SponsorData {
  id: string;
  companyName: string;
  industry: string | null;
  website: string | null;
  logoUrl: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string;
  taxId: string | null;
  socialMedia: string | null;
  contactPersonName: string | null;
  contactPersonEmail: string | null;
  contactPersonPhone: string | null;
  contactPersonPosition: string | null;
  ceoName: string | null;
  marketingDirector: string | null;
  brandManager: string | null;
  prManager: string | null;
  sponsorshipManager: string | null;
  financeOfficer: string | null;
  status: string;
  totalValue: number;
  currency: string;
  notes: string | null;
  tags: string | null;
}

export default function EditSponsorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    website: "",
    logoUrl: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Ethiopia",
    taxId: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    ceoName: "",
    marketingDirector: "",
    brandManager: "",
    prManager: "",
    sponsorshipManager: "",
    financeOfficer: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    contactPersonPosition: "",
    status: "prospect",
    totalValue: "",
    currency: "ETB",
    notes: "",
    tags: "",
  });

  useEffect(() => {
    const fetchSponsor = async () => {
      try {
        const res = await fetch(`/api/sponsors/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data: SponsorData = await res.json();

        let social: Record<string, string> = {};
        try {
          if (data.socialMedia) social = JSON.parse(data.socialMedia);
        } catch {}

        let parsedTags: string[] = [];
        try {
          if (data.tags) parsedTags = JSON.parse(data.tags);
        } catch {}

        setForm({
          companyName: data.companyName || "",
          industry: data.industry || "",
          website: data.website || "",
          logoUrl: data.logoUrl || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          country: data.country || "Ethiopia",
          taxId: data.taxId || "",
          facebook: social.facebook || "",
          instagram: social.instagram || "",
          twitter: social.twitter || "",
          linkedin: social.linkedin || "",
          ceoName: data.ceoName || "",
          marketingDirector: data.marketingDirector || "",
          brandManager: data.brandManager || "",
          prManager: data.prManager || "",
          sponsorshipManager: data.sponsorshipManager || "",
          financeOfficer: data.financeOfficer || "",
          contactPersonName: data.contactPersonName || "",
          contactPersonEmail: data.contactPersonEmail || "",
          contactPersonPhone: data.contactPersonPhone || "",
          contactPersonPosition: data.contactPersonPosition || "",
          status: data.status || "prospect",
          totalValue: String(data.totalValue || 0),
          currency: data.currency || "ETB",
          notes: data.notes || "",
          tags: parsedTags.join(", "),
        });
      } catch {
        router.push("/admin/sponsors");
      } finally {
        setLoading(false);
      }
    };
    fetchSponsor();
  }, [id, router]);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/sponsors/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push(`/admin/sponsors/${id}`);
      }
    } catch {
      console.error("Failed to update sponsor");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  const editTabs = [
    { id: "company", label: "Company", icon: Building2 },
    { id: "contacts", label: "Contacts", icon: Users },
    { id: "pipeline", label: "Pipeline", icon: TrendingUp },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-warm-white/40 hover:text-warm-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
          Edit Sponsor
        </h1>
        <p className="text-warm-white/40 mt-1">
          Update {form.companyName}&apos;s profile
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {editTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === t.id
                ? "bg-gold/15 text-gold border border-gold/30"
                : "text-warm-white/40 hover:text-warm-white hover:bg-surface-light border border-transparent"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <Card variant="glass" className="p-6">
        {activeTab === "company" && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-warm-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-gold" /> Company Information
            </h2>

            <div>
              <label className={labelClass}>Company Name *</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => update("companyName", e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Industry</label>
                <select
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Country</label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) => update("country", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Website</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => update("website", e.target.value)}
                  className={inputClass}
                  placeholder="https://"
                />
              </div>
              <div>
                <label className={labelClass}>Logo URL</label>
                <input
                  type="url"
                  value={form.logoUrl}
                  onChange={(e) => update("logoUrl", e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Tax ID</label>
                <input
                  type="text"
                  value={form.taxId}
                  onChange={(e) => update("taxId", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Social Media</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="url"
                  value={form.facebook}
                  onChange={(e) => update("facebook", e.target.value)}
                  className={inputClass}
                  placeholder="Facebook URL"
                />
                <input
                  type="url"
                  value={form.instagram}
                  onChange={(e) => update("instagram", e.target.value)}
                  className={inputClass}
                  placeholder="Instagram URL"
                />
                <input
                  type="url"
                  value={form.twitter}
                  onChange={(e) => update("twitter", e.target.value)}
                  className={inputClass}
                  placeholder="Twitter/X URL"
                />
                <input
                  type="url"
                  value={form.linkedin}
                  onChange={(e) => update("linkedin", e.target.value)}
                  className={inputClass}
                  placeholder="LinkedIn URL"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-warm-white flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" /> Key Contacts
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>CEO Name</label>
                <input
                  type="text"
                  value={form.ceoName}
                  onChange={(e) => update("ceoName", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Marketing Director</label>
                <input
                  type="text"
                  value={form.marketingDirector}
                  onChange={(e) => update("marketingDirector", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Brand Manager</label>
                <input
                  type="text"
                  value={form.brandManager}
                  onChange={(e) => update("brandManager", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>PR Manager</label>
                <input
                  type="text"
                  value={form.prManager}
                  onChange={(e) => update("prManager", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Sponsorship Manager</label>
                <input
                  type="text"
                  value={form.sponsorshipManager}
                  onChange={(e) => update("sponsorshipManager", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Finance Officer</label>
                <input
                  type="text"
                  value={form.financeOfficer}
                  onChange={(e) => update("financeOfficer", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h3 className="text-sm font-bold text-warm-white mb-4 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-gold" /> Primary Contact Person
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    value={form.contactPersonName}
                    onChange={(e) => update("contactPersonName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Position</label>
                  <input
                    type="text"
                    value={form.contactPersonPosition}
                    onChange={(e) =>
                      update("contactPersonPosition", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={form.contactPersonEmail}
                    onChange={(e) =>
                      update("contactPersonEmail", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    type="tel"
                    value={form.contactPersonPhone}
                    onChange={(e) =>
                      update("contactPersonPhone", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-warm-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-gold" /> Pipeline & Value
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Pipeline Status</label>
                <select
                  value={form.status}
                  onChange={(e) => update("status", e.target.value)}
                  className={selectClass}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => update("currency", e.target.value)}
                  className={selectClass}
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Estimated Total Value</label>
              <input
                type="number"
                min="0"
                value={form.totalValue}
                onChange={(e) => update("totalValue", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                className={inputClass}
                placeholder="Comma separated tags"
              />
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={saving || !form.companyName}
            className="gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
