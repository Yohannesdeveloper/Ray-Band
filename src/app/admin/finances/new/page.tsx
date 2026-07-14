"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, DollarSign, Save,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const incomeCategoryOptions = [
  { value: "event_revenue", label: "Event Revenue" },
  { value: "sponsorship", label: "Sponsorship" },
  { value: "course_enrollment", label: "Course Enrollment" },
  { value: "merchandise", label: "Merchandise" },
  { value: "grant", label: "Grant" },
  { value: "other", label: "Other" },
];

const expenseCategoryOptions = [
  { value: "venue", label: "Venue" },
  { value: "equipment", label: "Equipment" },
  { value: "transport", label: "Transport" },
  { value: "accommodation", label: "Accommodation" },
  { value: "catering", label: "Catering" },
  { value: "marketing", label: "Marketing" },
  { value: "salary", label: "Salary" },
  { value: "rent", label: "Rent" },
  { value: "utilities", label: "Utilities" },
  { value: "personnel", label: "Personnel" },
  { value: "other", label: "Other" },
];

const paymentMethodOptions = [
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "mobile_money", label: "Mobile Money" },
  { value: "card", label: "Card" },
];

export default function NewTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [type, setType] = useState("income");
  const [category, setCategory] = useState("event_revenue");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [eventId, setEventId] = useState("");
  const [sponsorId, setSponsorId] = useState("");
  const [receiptUrl, setReceiptUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [transactionDate, setTransactionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const categoryOptions = type === "income" ? incomeCategoryOptions : expenseCategoryOptions;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      setError("Description and amount are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/finances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          category,
          description,
          amount: Number(amount),
          currency,
          reference: reference || null,
          paymentMethod: paymentMethod || null,
          eventId: eventId || null,
          sponsorId: sponsorId || null,
          receiptUrl: receiptUrl || null,
          notes: notes || null,
          transactionDate: transactionDate || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create transaction");
      }

      router.push("/admin/finances");
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
          href="/admin/finances"
          className="p-2 rounded-lg hover:bg-surface-light transition-colors text-warm-white/60 hover:text-warm-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Add Transaction
          </h1>
          <p className="text-warm-white/40 mt-1">
            Record a new financial transaction
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
            <DollarSign className="w-5 h-5 text-gold" />
            Transaction Details
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setCategory(
                        e.target.value === "income" ? "event_revenue" : "venue"
                      );
                    }}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    {typeOptions.map((opt) => (
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
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    {categoryOptions.map((opt) => (
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
              label="Description"
              placeholder="e.g. Sound system rental for concert"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Currency
                </label>
                <div className="relative">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <Input
              label="Transaction Date"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
            />
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4">
            Payment & References
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Reference Number"
                placeholder="e.g. INV-2024-001"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Payment Method
                </label>
                <div className="relative">
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    <option value="">Select method</option>
                    {paymentMethodOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Event ID (optional)"
                placeholder="Link to an event"
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
              />
              <Input
                label="Sponsor ID (optional)"
                placeholder="Link to a sponsor"
                value={sponsorId}
                onChange={(e) => setSponsorId(e.target.value)}
              />
            </div>

            <Input
              label="Receipt URL"
              placeholder="https://... (optional scanned receipt)"
              value={receiptUrl}
              onChange={(e) => setReceiptUrl(e.target.value)}
            />
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-warm-white/80 mb-2">
              Notes
            </label>
            <textarea
              placeholder="Additional notes about this transaction..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
            />
          </div>
        </Card>

        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin/finances">
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
            Save Transaction
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
