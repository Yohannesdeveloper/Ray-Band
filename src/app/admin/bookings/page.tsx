"use client";

import { useState, useEffect } from "react";
import {
  Search, Filter, ChevronDown,
  Calendar, Loader2, AlertCircle, Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  eventType: string;
  eventDate: string | null;
  startTime: string | null;
  location: string | null;
  venueName: string | null;
  guestCount: string | null;
  musicStyles: string;
  addOns: string;
  budget: string | null;
  additionalRequests: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  status: string;
  estimatedAmount: number | null;
  paymentId: string | null;
  payment?: { txRef: string; status: string; amount: number } | null;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; variant: "default" | "gold" | "red" | "outline" | "glass" }> = {
  pending: { label: "Pending", variant: "gold" },
  confirmed: { label: "Confirmed", variant: "default" },
  cancelled: { label: "Cancelled", variant: "red" },
  completed: { label: "Completed", variant: "glass" },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesFilter = filter === "All" || b.status === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      b.contactName?.toLowerCase().includes(q) ||
      b.contactEmail?.toLowerCase().includes(q) ||
      b.eventType.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    totalValue: bookings.reduce((sum, b) => sum + (b.estimatedAmount || 0), 0),
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const parseJsonArray = (val: string): string[] => {
    try { return JSON.parse(val); } catch { return []; }
  };

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
            Bookings
          </h1>
          <p className="text-warm-white/40 mt-1">
            Manage all event booking requests
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="text"
            placeholder="Search by name, email, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            {["All", "pending", "confirmed", "cancelled", "completed"].map((type) => (
              <option key={type} value={type}>{type === "All" ? "All" : type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-warm-white">{stats.total}</p>
          <p className="text-xs text-warm-white/40">Total</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.confirmed}</p>
          <p className="text-xs text-warm-white/40">Confirmed</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.pending}</p>
          <p className="text-xs text-warm-white/40">Pending</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-gold">ETB {stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-warm-white/40">Total Value</p>
        </Card>
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Calendar className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No bookings yet</p>
          <p className="text-warm-white/30 text-sm">Bookings will appear here once customers start booking events.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const status = statusConfig[booking.status] || statusConfig.pending;
            const styles = parseJsonArray(booking.musicStyles);
            return (
              <Card key={booking.id} variant="glass" className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-warm-white truncate">
                        {booking.contactName || "Unknown Client"}
                      </h3>
                      <Badge variant={status.variant} size="sm">{status.label}</Badge>
                      {booking.payment && (
                        <Badge
                          variant={booking.payment.status === "success" ? "default" : booking.payment.status === "failed" ? "red" : "gold"}
                          size="sm"
                        >
                          Payment: {booking.payment.status}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warm-white/50">
                      <span className="capitalize">{booking.eventType}</span>
                      {booking.eventDate && <span>{formatDate(booking.eventDate)}</span>}
                      {booking.venueName && <span>{booking.venueName}</span>}
                      {booking.guestCount && <span>{booking.guestCount} guests</span>}
                      {booking.estimatedAmount && (
                        <span className="text-gold font-medium">ETB {booking.estimatedAmount.toLocaleString()}</span>
                      )}
                    </div>
                    {styles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {styles.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-warm-white/30 shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatDate(booking.createdAt)}
                  </div>
                </div>
                {booking.additionalRequests && (
                  <p className="mt-3 pt-3 border-t border-border text-xs text-warm-white/40 line-clamp-2">
                    {booking.additionalRequests}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
