"use client";

import { useState } from "react";
import {
  Calendar, MapPin, Users, Music, DollarSign,
  MessageSquare, Check, ArrowRight, ArrowLeft,
  Heart, Building2, PartyPopper, Cake, Hotel,
  UtensilsCrossed, Mic2, Tent, Church, Sparkles,
  CreditCard,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaymentCheckout } from "@/components/booking/payment-checkout";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Event Type", icon: Sparkles },
  { id: 2, label: "Date", icon: Calendar },
  { id: 3, label: "Location", icon: MapPin },
  { id: 4, label: "Guests", icon: Users },
  { id: 5, label: "Music", icon: Music },
  { id: 6, label: "Budget", icon: DollarSign },
  { id: 7, label: "Details", icon: MessageSquare },
  { id: 8, label: "Payment", icon: CreditCard },
];

const eventTypes = [
  { icon: Heart, label: "Wedding", value: "wedding" },
  { icon: Cake, label: "Birthday", value: "birthday" },
  { icon: Building2, label: "Corporate", value: "corporate" },
  { icon: Hotel, label: "Hotel", value: "hotel" },
  { icon: UtensilsCrossed, label: "Restaurant", value: "restaurant" },
  { icon: Tent, label: "Festival", value: "festival" },
  { icon: Mic2, label: "Concert", value: "concert" },
  { icon: Church, label: "Church", value: "church" },
  { icon: PartyPopper, label: "Private Party", value: "private" },
];

const musicStyles = [
  "Jazz", "Pop", "Rock", "Traditional", "Acoustic",
  "R&B/Soul", "Afrobeats", "Gospel", "Classical", "Mix of All",
];

const addOns = [
  "DJ Service", "MC/Host", "Sound System", "Lighting",
  "Photography", "Videography", "Live Streaming",
];

export default function BookPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: "",
    date: "",
    time: "",
    duration: "",
    venue: "",
    venueType: "",
    location: "",
    guests: "",
    musicStyles: [] as string[],
    additionalRequests: "",
    budget: "",
    name: "",
    email: "",
    phone: "",
    addOns: [] as string[],
  });

  const update = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "musicStyles" | "addOns", item: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(item)
        ? (prev[field] as string[]).filter((i) => i !== item)
        : [...(prev[field] as string[]), item],
    }));
  };

  // Calculate amount based on duration (hourly rate)
  const getEstimatedAmount = () => {
    const hourlyRates: Record<string, number> = {
      "1": 200,
      "2": 180,
      "3": 160,
      "4": 150,
    };
    const hours = parseInt(formData.duration) || 1;
    const rate = hourlyRates[formData.duration] || 200;
    return hours * rate;
  };

  const next = () => setCurrentStep((s) => Math.min(s + 1, 8));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <Badge variant="gold" className="mb-4">Book the Band</Badge>
              <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)]">
                Create Your <span className="gradient-text">Perfect Event</span>
              </h1>
              <p className="text-warm-white/50 mt-2 text-sm">
                Complete the steps below and we&apos;ll create a custom proposal for you.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className={cn(
                      "flex items-center gap-2",
                      step.id <= currentStep ? "text-gold" : "text-warm-white/30"
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        step.id < currentStep
                          ? "bg-gold text-charcoal"
                          : step.id === currentStep
                          ? "bg-gold/20 border border-gold text-gold"
                          : "bg-surface-light border border-border text-warm-white/30"
                      )}
                    >
                      {step.id < currentStep ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        step.id
                      )}
                    </div>
                    <span className="hidden md:block text-xs font-medium">
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="h-1 bg-surface-light rounded-full">
                <div
                  className="h-full bg-gold rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep - 1) / 7) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Content */}
            <Card variant="bordered" padding="lg">
              {/* Step 1: Event Type */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    What type of event?
                  </h2>
                  <p className="text-sm text-warm-white/40 mb-6">
                    Select the type of event you&apos;re planning.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {eventTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => update("eventType", type.value)}
                        className={cn(
                          "p-4 rounded-xl border text-center transition-all",
                          formData.eventType === type.value
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border hover:border-border-light text-warm-white/60 hover:text-warm-white"
                        )}
                      >
                        <type.icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Date */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    When is your event?
                  </h2>
                  <p className="text-sm text-warm-white/40 mb-6">
                    Select your preferred date and time.
                  </p>
                  <div className="space-y-4">
                    <Input
                      label="Event Date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                    <div>
                      <label className="block text-sm font-medium text-warm-white/80 mb-2">Preferred Time</label>
                      <div className="grid grid-cols-3 gap-3">
                        {["Morning", "Afternoon", "Evening"].map((time) => (
                          <button
                            key={time}
                            onClick={() => update("time", time.toLowerCase())}
                            className={cn(
                              "p-3 rounded-xl border text-sm font-medium transition-all",
                              formData.time === time.toLowerCase()
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-border text-warm-white/60 hover:border-border-light"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-warm-white/80 mb-2">Performance Duration</label>
                      <p className="text-xs text-warm-white/40 mb-3">Pricing is based on the duration of the performance.</p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "1 Hour", value: "1", price: "$200/hr" },
                          { label: "2 Hours", value: "2", price: "$180/hr" },
                          { label: "3 Hours", value: "3", price: "$160/hr" },
                          { label: "4+ Hours", value: "4", price: "$150/hr" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => update("duration", option.value)}
                            className={cn(
                              "p-4 rounded-xl border text-left transition-all",
                              formData.duration === option.value
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-border text-warm-white/60 hover:border-border-light"
                            )}
                          >
                            <span className="text-sm font-medium block">{option.label}</span>
                            <span className={cn(
                              "text-xs",
                              formData.duration === option.value ? "text-gold/70" : "text-warm-white/40"
                            )}>{option.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    Where is your event?
                  </h2>
                  <p className="text-sm text-warm-white/40 mb-6">
                    Tell us about the venue and location.
                  </p>
                  <div className="space-y-4">
                    <Input
                      label="Venue Name"
                      placeholder="e.g., Sheraton Addis Ababa"
                      value={formData.venue}
                      onChange={(e) => update("venue", e.target.value)}
                    />
                    <Input
                      label="City / Location"
                      placeholder="e.g., Addis Ababa"
                      value={formData.location}
                      onChange={(e) => update("location", e.target.value)}
                    />
                    <div>
                      <label className="block text-sm font-medium text-warm-white/80 mb-2">Venue Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Indoor", "Outdoor", "Both", "Not Sure"].map((type) => (
                          <button
                            key={type}
                            onClick={() => update("venueType", type.toLowerCase())}
                            className={cn(
                              "p-3 rounded-xl border text-sm font-medium transition-all",
                              formData.venueType === type.toLowerCase()
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-border text-warm-white/60 hover:border-border-light"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Guests */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    How many guests?
                  </h2>
                  <p className="text-sm text-warm-white/40 mb-6">
                    This helps us recommend the right band configuration.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["Under 50", "50-100", "100-200", "200-500", "500-1000", "1000+"].map((range) => (
                      <button
                        key={range}
                        onClick={() => update("guests", range)}
                        className={cn(
                          "p-4 rounded-xl border text-sm font-medium transition-all",
                          formData.guests === range
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border text-warm-white/60 hover:border-border-light"
                        )}
                      >
                        {range} guests
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Music */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    Music preferences?
                  </h2>
                  <p className="text-sm text-warm-white/40 mb-6">
                    Select all genres you&apos;d like us to perform. (Select multiple)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {musicStyles.map((style) => (
                      <button
                        key={style}
                        onClick={() => toggleArrayItem("musicStyles", style)}
                        className={cn(
                          "px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
                          formData.musicStyles.includes(style)
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border text-warm-white/60 hover:border-border-light"
                        )}
                      >
                        {style}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-medium text-warm-white/80 mb-3">Add-on Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {addOns.map((addon) => (
                        <button
                          key={addon}
                          onClick={() => toggleArrayItem("addOns", addon)}
                          className={cn(
                            "px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
                            formData.addOns.includes(addon)
                              ? "border-gold bg-gold/10 text-gold"
                              : "border-border text-warm-white/60 hover:border-border-light"
                          )}
                        >
                          {addon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Budget */}
              {currentStep === 6 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    What&apos;s your budget?
                  </h2>
                  <p className="text-sm text-warm-white/40 mb-6">
                    This helps us recommend the best package for you.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Under $500", value: "under-500" },
                      { label: "$500 - $1,000", value: "500-1000" },
                      { label: "$1,000 - $2,500", value: "1000-2500" },
                      { label: "$2,500 - $5,000", value: "2500-5000" },
                      { label: "$5,000 - $10,000", value: "5000-10000" },
                      { label: "$10,000+", value: "10000+" },
                    ].map((budget) => (
                      <button
                        key={budget.value}
                        onClick={() => update("budget", budget.value)}
                        className={cn(
                          "p-4 rounded-xl border text-sm font-medium transition-all",
                          formData.budget === budget.value
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border text-warm-white/60 hover:border-border-light"
                        )}
                      >
                        {budget.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 7: Details */}
              {currentStep === 7 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    Almost there!
                  </h2>
                  <p className="text-sm text-warm-white/40 mb-6">
                    Share any additional details and your contact information.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-warm-white/80 mb-2">
                        Additional Requests
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Special song requests, specific timings, theme details..."
                        value={formData.additionalRequests}
                        onChange={(e) => update("additionalRequests", e.target.value)}
                        className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white placeholder:text-warm-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Your Name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) => update("name", e.target.value)}
                        required
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        placeholder="+251..."
                        value={formData.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        required
                      />
                    </div>
                    <Input
                      label="Email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => update("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 8: Payment */}
              {currentStep === 8 && (
                <div>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                    Complete Your Payment
                  </h2>
                  <p className="text-sm text-warm-white/40 mb-6">
                    Secure payment powered by Chapa. You&apos;ll be redirected to
                    choose your preferred payment method.
                  </p>
                   <PaymentCheckout
                    amount={getEstimatedAmount()}
                    eventType={formData.eventType}
                    eventDate={formData.date}
                    duration={formData.duration ? `${formData.duration} hour(s)` : undefined}
                    onSuccess={async (txRef, paymentId) => {
                      try {
                        await fetch("/api/bookings", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            eventType: formData.eventType,
                            eventDate: formData.date,
                            startTime: formData.time || null,
                            duration: formData.duration ? parseInt(formData.duration) : null,
                            location: formData.location || null,
                            venueName: formData.venue || null,
                            guestCount: formData.guests || null,
                            musicStyles: formData.musicStyles,
                            addOns: formData.addOns,
                            budget: formData.budget,
                            additionalRequests: formData.additionalRequests || null,
                            contactName: formData.name || null,
                            contactEmail: formData.email || null,
                            contactPhone: formData.phone || null,
                            estimatedAmount: getEstimatedAmount(),
                            paymentId: paymentId || null,
                          }),
                        });
                      } catch (err) {
                        console.error("Failed to save booking:", err);
                      }
                    }}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={prev}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </Button>
                {currentStep < 8 ? (
                  <Button variant="primary" onClick={next}>
                    Next <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : null}
              </div>
            </Card>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
