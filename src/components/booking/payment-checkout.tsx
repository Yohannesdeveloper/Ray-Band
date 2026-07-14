"use client";

import { useState } from "react";
import {
  CreditCard, Loader2, Lock, Shield, AlertCircle,
  Smartphone, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatAmount } from "@/lib/payment/chapa";

interface PaymentCheckoutProps {
  amount: number;
  eventType?: string;
  eventDate?: string;
  duration?: string;
  onSuccess?: (txRef: string, paymentId?: string) => void;
}

export function PaymentCheckout({
  amount,
  eventType,
  eventDate,
  duration,
  onSuccess,
  }: PaymentCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"details" | "processing">("details");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    paymentMethod: "card",
  });

  const update = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setStep("processing");

    try {
      if (formData.paymentMethod === "mobile") {
        if (onSuccess) {
          onSuccess("telbirr-direct", undefined);
        }
        window.location.href = "https://app.ethiostone.com/ethiostore/teleBirrH5/teleBirrH5CollectPage";
        return;
      }

      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber || undefined,
          eventType,
          eventDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Payment initialization failed");
      }

      if (data.checkoutUrl) {
        if (onSuccess) {
          onSuccess(data.txRef, data.paymentId);
        }
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setStep("details");
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === "processing") {
    return (
      <Card variant="glass" padding="lg" className="text-center">
        <Loader2 className="w-12 h-12 text-gold mx-auto animate-spin mb-4" />
        <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] mb-2">
          {formData.paymentMethod === "mobile" ? "Redirecting to Telebirr..." : "Redirecting to Payment..."}
        </h3>
        <p className="text-sm text-warm-white/50">
          {formData.paymentMethod === "mobile"
            ? "You'll be redirected to Telebirr's secure payment page."
            : "You&apos;ll be redirected to Chapa&apos;s secure checkout page."}
          Please don&apos;t close this window.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="glass" padding="lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
          <Lock className="w-5 h-5 text-gold" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)]">
            Secure Payment
          </h3>
          <p className="text-xs text-warm-white/40">
            Powered by Chapa — 256-bit SSL encryption
          </p>
        </div>
      </div>

      {/* Amount Summary */}
      <div className="bg-surface-light rounded-xl p-4 mb-6 border border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-warm-white/60">Amount to Pay</span>
          <span className="text-2xl font-bold gradient-text">
            {formatAmount(amount)}
          </span>
        </div>
        {eventType && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <span className="text-xs text-warm-white/40">Event Type</span>
            <Badge variant="gold" size="sm">{eventType}</Badge>
          </div>
        )}
        {duration && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <span className="text-xs text-warm-white/40">Duration</span>
            <Badge variant="gold" size="sm">{duration}</Badge>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-warm-white/80 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "card", icon: CreditCard, label: "Card" },
            { id: "mobile", icon: Smartphone, label: "Mobile" },
            { id: "bank", icon: Building2, label: "Bank" },
          ].map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => update("paymentMethod", method.id)}
              className={cn(
                "p-3 rounded-xl border text-center transition-all",
                formData.paymentMethod === method.id
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border text-warm-white/60 hover:border-border-light"
              )}
            >
              <method.icon className="w-5 h-5 mx-auto mb-1" />
              <span className="text-xs font-medium">{method.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-warm-white/30">
          Mobile payment will redirect you to Telebirr. Card and Bank go through Chapa&apos;s secure checkout.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="First name"
            value={formData.firstName}
            onChange={(e) => update("firstName", e.target.value)}
            required
          />
          <Input
            label="Last Name"
            placeholder="Last name"
            value={formData.lastName}
            onChange={(e) => update("lastName", e.target.value)}
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
        <Input
          label="Phone Number (Optional)"
          type="tel"
          placeholder="09xxxxxxxx or 07xxxxxxxx"
          value={formData.phoneNumber}
          onChange={(e) => update("phoneNumber", e.target.value)}
        />

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay {formatAmount(amount)}
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-warm-white/20">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" /> Secure
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> Encrypted
          </span>
          <span>Powered by Chapa</span>
        </div>
      </form>
    </Card>
  );
}
