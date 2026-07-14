"use client";

import { useState } from "react";
import {
  DollarSign, TrendingUp, CreditCard, ArrowUpRight,
  Download, Filter, ChevronDown, Search,
  Receipt,
} from "lucide-react";
import { Card } from "@/components/ui/card";

const methodLabels: Record<string, string> = {
  telebirr: "Telebirr",
  cbe_birr: "CBE Birr",
  mpesa: "M-Pesa",
  card: "Card",
  bank_transfer: "Bank Transfer",
};

const methodColors: Record<string, string> = {
  telebirr: "bg-green-500/10 text-green-400",
  cbe_birr: "bg-blue-500/10 text-blue-400",
  mpesa: "bg-red-500/10 text-red-400",
  card: "bg-violet-500/10 text-violet-400",
  bank_transfer: "bg-amber-500/10 text-amber-400",
};

export default function AdminPaymentsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Payments
          </h1>
          <p className="text-warm-white/40 mt-1">
            Track all transactions and revenue
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-white/40">Total Revenue</p>
              <p className="text-2xl font-bold text-warm-white mt-1">ETB 0</p>
            </div>
            <div className="p-2.5 rounded-lg bg-gold/10">
              <DollarSign className="w-5 h-5 text-gold" />
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-white/40">Bookings</p>
              <p className="text-2xl font-bold text-warm-white mt-1">ETB 0</p>
            </div>
            <div className="p-2.5 rounded-lg bg-blue-500/10">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-white/40">Courses</p>
              <p className="text-2xl font-bold text-warm-white mt-1">ETB 0</p>
            </div>
            <div className="p-2.5 rounded-lg bg-violet-500/10">
              <CreditCard className="w-5 h-5 text-violet-400" />
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-warm-white/40">Shop</p>
              <p className="text-2xl font-bold text-warm-white mt-1">ETB 0</p>
            </div>
            <div className="p-2.5 rounded-lg bg-emerald-500/10">
              <ArrowUpRight className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </Card>
      </div>

      <Card variant="glass" className="p-6 mb-8">
        <h2 className="text-lg font-bold text-warm-white mb-4">Payment Methods</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(methodLabels).map(([key, label]) => (
            <div key={key} className="p-3 rounded-lg bg-surface-light/50 border border-border/50">
              <span className={`text-xs px-2 py-0.5 rounded-full ${methodColors[key]}`}>
                {label}
              </span>
              <p className="text-lg font-bold text-warm-white mt-2">0</p>
              <p className="text-xs text-warm-white/40">ETB 0</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="text"
            placeholder="Search by customer or transaction ref..."
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
            <option value="all">All Transactions</option>
            <option value="success">Successful</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="booking">Bookings</option>
            <option value="course">Courses</option>
            <option value="shop">Shop</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
      </div>

      <Card variant="glass" className="p-12 text-center">
        <Receipt className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
        <p className="text-warm-white/40 text-lg mb-2">No transactions yet</p>
        <p className="text-warm-white/30 text-sm">Payment records will appear here once transactions are made.</p>
      </Card>
    </div>
  );
}
