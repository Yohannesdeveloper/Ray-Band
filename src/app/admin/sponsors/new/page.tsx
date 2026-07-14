"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Users,
  UserPlus,
  TrendingUp,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Plus,
  Globe,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Share2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const steps = [
  { id: 1, label: "Company Info", icon: Building2 },
  { id: 2, label: "Key Contacts", icon: Users },
  { id: 3, label: "Primary Contact", icon: UserPlus },
  { id: 4, label: "Pipeline & Value", icon: TrendingUp },
];

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
  { value: "active", label: "Active" },
];

const inputClass =
  "w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50";
const labelClass = "block text-xs font-medium text-warm-white/50 mb-1.5";
const selectClass =
  "w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 cursor-pointer appearance-none";

export default function NewSponsorPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    website: "",
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
    contactLinkedIn: "",
    status: "prospect",
    totalValue: "",
    currency: "ETB",
    notes: "",
    tags: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/sponsors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push("/admin/sponsors");
      }
    } catch {
      console.error("Failed to create sponsor");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-warm-white/40 hover:text-warm-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Sponsors
        </button>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
          Add New Sponsor
        </h1>
        <p className="text-warm-white/40 mt-1">
          Create a new sponsor profile and add them to your pipeline
        </p>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <button
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                step === s.id
                  ? "bg-gold/15 text-gold border border-gold/30"
                  : step > s.id
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-surface-light text-warm-white/40 border border-border"
              }`}
            >
              {step > s.id ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <s.icon className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && (
              <div className="w-6 h-px bg-border mx-1 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Card variant="glass" className="p-6">
        {step === 1 && (
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
                placeholder="e.g. Ethio Telecom"
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
                  placeholder="Ethiopia"
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
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                  placeholder="info@company.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                  placeholder="+251 91 234 5678"
                />
              </div>
              <div>
                <label className={labelClass}>Tax ID</label>
                <input
                  type="text"
                  value={form.taxId}
                  onChange={(e) => update("taxId", e.target.value)}
                  className={inputClass}
                  placeholder="TIN number"
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
                placeholder="Street address"
              />
            </div>

            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                className={inputClass}
                placeholder="Addis Ababa"
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

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-warm-white flex items-center gap-2">
              <Users className="w-5 h-5 text-gold" /> Key Contacts
            </h2>
            <p className="text-xs text-warm-white/40">
              Record key personnel at the organization
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>CEO Name</label>
                <input
                  type="text"
                  value={form.ceoName}
                  onChange={(e) => update("ceoName", e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelClass}>Marketing Director</label>
                <input
                  type="text"
                  value={form.marketingDirector}
                  onChange={(e) => update("marketingDirector", e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelClass}>Brand Manager</label>
                <input
                  type="text"
                  value={form.brandManager}
                  onChange={(e) => update("brandManager", e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelClass}>PR Manager</label>
                <input
                  type="text"
                  value={form.prManager}
                  onChange={(e) => update("prManager", e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelClass}>Sponsorship Manager</label>
                <input
                  type="text"
                  value={form.sponsorshipManager}
                  onChange={(e) => update("sponsorshipManager", e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelClass}>Finance Officer</label>
                <input
                  type="text"
                  value={form.financeOfficer}
                  onChange={(e) => update("financeOfficer", e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-warm-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold" /> Primary Contact Person
            </h2>
            <p className="text-xs text-warm-white/40">
              The main point of contact for this sponsor
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  type="text"
                  required
                  value={form.contactPersonName}
                  onChange={(e) => update("contactPersonName", e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className={labelClass}>Position</label>
                <input
                  type="text"
                  value={form.contactPersonPosition}
                  onChange={(e) => update("contactPersonPosition", e.target.value)}
                  className={inputClass}
                  placeholder="Job title"
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={form.contactPersonEmail}
                  onChange={(e) => update("contactPersonEmail", e.target.value)}
                  className={inputClass}
                  placeholder="email@company.com"
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  value={form.contactPersonPhone}
                  onChange={(e) => update("contactPersonPhone", e.target.value)}
                  className={inputClass}
                  placeholder="+251 91 234 5678"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>LinkedIn Profile</label>
              <input
                type="url"
                value={form.contactLinkedIn}
                onChange={(e) => update("contactLinkedIn", e.target.value)}
                className={inputClass}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        )}

        {step === 4 && (
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
                placeholder="0"
              />
            </div>

            <div>
              <label className={labelClass}>Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                className={inputClass}
                placeholder="e.g. tech, telecom, premium (comma separated)"
              />
            </div>

            <div>
              <label className={labelClass}>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder="Any additional notes about this sponsor..."
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? "Cancel" : "Previous"}
          </Button>

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              onClick={() => setStep(step + 1)}
              className="gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              onClick={handleSubmit}
              disabled={saving || !form.companyName}
              className="gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Create Sponsor
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
