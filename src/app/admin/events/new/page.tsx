"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Check, Loader2,
  Calendar, MapPin, DollarSign, Wrench, Users, Info,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { value: "concert", label: "Concert" },
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate" },
  { value: "festival", label: "Festival" },
  { value: "government", label: "Government" },
  { value: "university", label: "University" },
  { value: "hotel", label: "Hotel" },
  { value: "club", label: "Club" },
  { value: "birthday", label: "Birthday" },
  { value: "cultural", label: "Cultural" },
  { value: "religious", label: "Religious" },
  { value: "charity", label: "Charity" },
  { value: "private", label: "Private" },
] as const;

const STEPS = [
  { label: "Basic Info", icon: Info },
  { label: "Venue & Logistics", icon: MapPin },
  { label: "Schedule", icon: Calendar },
  { label: "Budget & Finance", icon: DollarSign },
  { label: "Technical", icon: Wrench },
  { label: "Team & Contacts", icon: Users },
] as const;

interface FormData {
  name: string;
  category: string;
  priority: string;
  description: string;
  venue: string;
  venueAddress: string;
  venueGpsLat: string;
  venueGpsLng: string;
  capacity: string;
  transportation: string;
  accommodation: string;
  eventDate: string;
  eventEndDate: string;
  startTime: string;
  endTime: string;
  rehearsalDate: string;
  rehearsalTime: string;
  budget: string;
  estimatedCost: string;
  revenueProjection: string;
  ticketPrice: string;
  ticketType: string;
  equipmentChecklist: string;
  technicalRider: string;
  hospitalityRider: string;
  stageLayout: string;
  riskAssessment: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes: string;
}

const INITIAL: FormData = {
  name: "", category: "", priority: "normal", description: "",
  venue: "", venueAddress: "", venueGpsLat: "", venueGpsLng: "",
  capacity: "", transportation: "", accommodation: "",
  eventDate: "", eventEndDate: "", startTime: "", endTime: "",
  rehearsalDate: "", rehearsalTime: "",
  budget: "", estimatedCost: "", revenueProjection: "",
  ticketPrice: "", ticketType: "",
  equipmentChecklist: "", technicalRider: "", hospitalityRider: "",
  stageLayout: "", riskAssessment: "",
  contactName: "", contactEmail: "", contactPhone: "", notes: "",
};

export default function NewEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validateStep(): string | null {
    switch (step) {
      case 0:
        if (!form.name.trim()) return "Event name is required";
        if (!form.category) return "Please select a category";
        return null;
      case 1:
        if (!form.venue.trim()) return "Venue is required";
        return null;
      case 2:
        if (!form.eventDate) return "Event date is required";
        return null;
      default:
        return null;
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        name: form.name,
        category: form.category,
        priority: form.priority || "normal",
        description: form.description || null,
        venue: form.venue || null,
        venueAddress: form.venueAddress || null,
        venueGpsLat: form.venueGpsLat ? parseFloat(form.venueGpsLat) : null,
        venueGpsLng: form.venueGpsLng ? parseFloat(form.venueGpsLng) : null,
        capacity: form.capacity ? parseInt(form.capacity) : null,
        transportation: form.transportation || null,
        accommodation: form.accommodation || null,
        eventDate: form.eventDate ? new Date(form.eventDate).toISOString() : null,
        eventEndDate: form.eventEndDate ? new Date(form.eventEndDate).toISOString() : null,
        startTime: form.startTime || null,
        endTime: form.endTime || null,
        rehearsalDate: form.rehearsalDate ? new Date(form.rehearsalDate).toISOString() : null,
        rehearsalTime: form.rehearsalTime || null,
        budget: form.budget ? parseFloat(form.budget) : 0,
        estimatedCost: form.estimatedCost ? parseFloat(form.estimatedCost) : 0,
        revenueProjection: form.revenueProjection ? parseFloat(form.revenueProjection) : 0,
        ticketPrice: form.ticketPrice ? parseFloat(form.ticketPrice) : null,
        ticketType: form.ticketType || null,
        equipmentChecklist: form.equipmentChecklist ? JSON.stringify(form.equipmentChecklist.split("\n").filter(Boolean)) : null,
        technicalRider: form.technicalRider || null,
        hospitalityRider: form.hospitalityRider || null,
        stageLayout: form.stageLayout || null,
        riskAssessment: form.riskAssessment || null,
        contactName: form.contactName || null,
        contactEmail: form.contactEmail || null,
        contactPhone: form.contactPhone || null,
        notes: form.notes || null,
      };

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create event");
      }

      router.push("/admin/events");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function nextStep() {
    const validationError = validateStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function prevStep() {
    setError("");
    if (step > 0) setStep(step - 1);
  }

  const inputClass = "w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white placeholder:text-warm-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 hover:border-border-light text-sm";
  const selectClass = "w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 appearance-none cursor-pointer text-sm";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-warm-white/40 hover:text-warm-white text-sm mb-4 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
          Create New Event
        </h1>
        <p className="text-warm-white/40 mt-1">
          Fill in the details to create a new event
        </p>
      </div>

      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === step;
          const isCompleted = i < step;
          return (
            <div key={s.label} className="flex items-center gap-2 shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-gold/20 text-gold border border-gold/30"
                    : isCompleted
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                      : "bg-surface-light text-warm-white/30 border border-border"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
                <span className="sm:hidden">{i + 1}</span>
                {isCompleted && <Check className="w-3 h-3" />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-6 h-px ${isCompleted ? "bg-emerald-500/30" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 p-3 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
          {error}
        </div>
      )}

      <Card variant="bordered" padding="lg">
        {step === 0 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Basic Information</h2>
            <Input
              label="Event Name"
              placeholder="e.g. New Year Concert 2026"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Category</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={(e) => update("category", e.target.value)}
                  className={selectClass}
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Priority</label>
              <div className="relative">
                <select
                  value={form.priority}
                  onChange={(e) => update("priority", e.target.value)}
                  className={selectClass}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
                <ChevronDown />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Description</label>
              <textarea
                placeholder="Brief description of the event..."
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Venue & Logistics</h2>
            <Input
              label="Venue Name"
              placeholder="e.g. Millennium Hall"
              value={form.venue}
              onChange={(e) => update("venue", e.target.value)}
              required
            />
            <Input
              label="Venue Address"
              placeholder="e.g. Bole Road, Addis Ababa"
              value={form.venueAddress}
              onChange={(e) => update("venueAddress", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="GPS Latitude"
                type="number"
                step="any"
                placeholder="e.g. 9.0054"
                value={form.venueGpsLat}
                onChange={(e) => update("venueGpsLat", e.target.value)}
              />
              <Input
                label="GPS Longitude"
                type="number"
                step="any"
                placeholder="e.g. 38.7636"
                value={form.venueGpsLng}
                onChange={(e) => update("venueGpsLng", e.target.value)}
              />
            </div>
            <Input
              label="Capacity"
              type="number"
              placeholder="e.g. 5000"
              value={form.capacity}
              onChange={(e) => update("capacity", e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Transportation</label>
              <textarea
                placeholder="Transportation arrangements..."
                value={form.transportation}
                onChange={(e) => update("transportation", e.target.value)}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Accommodation</label>
              <textarea
                placeholder="Accommodation details..."
                value={form.accommodation}
                onChange={(e) => update("accommodation", e.target.value)}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Schedule</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Event Date"
                type="date"
                value={form.eventDate}
                onChange={(e) => update("eventDate", e.target.value)}
                required
              />
              <Input
                label="End Date"
                type="date"
                value={form.eventEndDate}
                onChange={(e) => update("eventEndDate", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={form.startTime}
                onChange={(e) => update("startTime", e.target.value)}
              />
              <Input
                label="End Time"
                type="time"
                value={form.endTime}
                onChange={(e) => update("endTime", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Rehearsal Date"
                type="date"
                value={form.rehearsalDate}
                onChange={(e) => update("rehearsalDate", e.target.value)}
              />
              <Input
                label="Rehearsal Time"
                type="time"
                value={form.rehearsalTime}
                onChange={(e) => update("rehearsalTime", e.target.value)}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Budget & Finance</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Budget"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.budget}
                onChange={(e) => update("budget", e.target.value)}
              />
              <Input
                label="Estimated Cost"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.estimatedCost}
                onChange={(e) => update("estimatedCost", e.target.value)}
              />
            </div>
            <Input
              label="Revenue Projection"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.revenueProjection}
              onChange={(e) => update("revenueProjection", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Ticket Price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={form.ticketPrice}
                onChange={(e) => update("ticketPrice", e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-warm-white/80 mb-2">Ticket Type</label>
                <div className="relative">
                  <select
                    value={form.ticketType}
                    onChange={(e) => update("ticketType", e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select type</option>
                    <option value="free">Free</option>
                    <option value="general">General Admission</option>
                    <option value="vip">VIP</option>
                    <option value="table">Table</option>
                    <option value="season">Season Pass</option>
                    <option value="early_bird">Early Bird</option>
                  </select>
                  <ChevronDown />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Technical Requirements</h2>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Equipment Checklist</label>
              <p className="text-xs text-warm-white/30 mb-2">Enter one item per line</p>
              <textarea
                placeholder={"Sound system\nLighting rig\nStage backdrop\nMicrophones\nMonitors"}
                value={form.equipmentChecklist}
                onChange={(e) => update("equipmentChecklist", e.target.value)}
                rows={6}
                className={inputClass + " resize-none font-mono text-xs"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Technical Rider</label>
              <textarea
                placeholder="Technical specifications and requirements..."
                value={form.technicalRider}
                onChange={(e) => update("technicalRider", e.target.value)}
                rows={4}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Hospitality Rider</label>
              <textarea
                placeholder="Hospitality requirements for artists/performers..."
                value={form.hospitalityRider}
                onChange={(e) => update("hospitalityRider", e.target.value)}
                rows={4}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Stage Layout</label>
              <textarea
                placeholder="Stage layout description or notes..."
                value={form.stageLayout}
                onChange={(e) => update("stageLayout", e.target.value)}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Risk Assessment</label>
              <textarea
                placeholder="Identified risks and mitigation plans..."
                value={form.riskAssessment}
                onChange={(e) => update("riskAssessment", e.target.value)}
                rows={4}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-warm-white mb-4">Team & Contacts</h2>
            <Input
              label="Contact Name"
              placeholder="Primary contact person"
              value={form.contactName}
              onChange={(e) => update("contactName", e.target.value)}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Contact Email"
                type="email"
                placeholder="email@example.com"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
              />
              <Input
                label="Contact Phone"
                type="tel"
                placeholder="+251 9XX XXX XXX"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-warm-white/80 mb-2">Notes</label>
              <textarea
                placeholder="Additional notes..."
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="ghost"
          onClick={prevStep}
          disabled={step === 0}
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        <div className="text-xs text-warm-white/30">
          Step {step + 1} of {STEPS.length}
        </div>
        {step === STEPS.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Create Event
              </>
            )}
          </Button>
        ) : (
          <Button onClick={nextStep}>
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
