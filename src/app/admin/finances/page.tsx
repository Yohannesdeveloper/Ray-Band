"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Filter, ChevronDown, DollarSign, Loader2, AlertCircle,
  Plus, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Calendar, CreditCard,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Transaction {
  id: string;
  type: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  reference: string | null;
  paymentMethod: string | null;
  eventId: string | null;
  sponsorId: string | null;
  receiptUrl: string | null;
  notes: string | null;
  transactionDate: string;
  createdAt: string;
}

const incomeCategories: Record<string, string> = {
  event_revenue: "Event Revenue",
  sponsorship: "Sponsorship",
  course_enrollment: "Course Enrollment",
  merchandise: "Merchandise",
  grant: "Grant",
  other: "Other",
};

const expenseCategories: Record<string, string> = {
  venue: "Venue",
  equipment: "Equipment",
  transport: "Transport",
  accommodation: "Accommodation",
  catering: "Catering",
  marketing: "Marketing",
  salary: "Salary",
  rent: "Rent",
  utilities: "Utilities",
  personnel: "Personnel",
  other: "Other",
};

const paymentMethodLabels: Record<string, string> = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  mobile_money: "Mobile Money",
  card: "Card",
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function AdminFinancesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/finances");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter((tx) => {
    const matchesType = typeFilter === "All" || tx.type === typeFilter;
    const matchesCategory = categoryFilter === "All" || tx.category === categoryFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      tx.description.toLowerCase().includes(q) ||
      tx.reference?.toLowerCase().includes(q) ||
      tx.category.toLowerCase().includes(q);
    const matchesDateFrom = !dateFrom || new Date(tx.transactionDate) >= new Date(dateFrom);
    const matchesDateTo = !dateTo || new Date(tx.transactionDate) <= new Date(dateTo + "T23:59:59");
    return matchesType && matchesCategory && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const now = new Date();
  const thisMonthTransactions = transactions.filter((tx) => {
    const d = new Date(tx.transactionDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthIncome = thisMonthTransactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
  const thisMonthExpenses = thisMonthTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monthTx = transactions.filter((tx) => {
      const d = new Date(tx.transactionDate);
      return d.getMonth() === i && d.getFullYear() === now.getFullYear();
    });
    return {
      month: monthNames[i],
      income: monthTx
        .filter((tx) => tx.type === "income")
        .reduce((sum, tx) => sum + tx.amount, 0),
      expense: monthTx
        .filter((tx) => tx.type === "expense")
        .reduce((sum, tx) => sum + tx.amount, 0),
    };
  });

  const maxBarValue = Math.max(
    ...monthlyData.map((d) => Math.max(d.income, d.expense)),
    1
  );

  const incomeByCategory: Record<string, number> = {};
  const expenseByCategory: Record<string, number> = {};
  transactions.forEach((tx) => {
    if (tx.type === "income") {
      incomeByCategory[tx.category] = (incomeByCategory[tx.category] || 0) + tx.amount;
    } else {
      expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
    }
  });

  const availableCategories =
    typeFilter === "income"
      ? incomeCategories
      : typeFilter === "expense"
      ? expenseCategories
      : { ...incomeCategories, ...expenseCategories };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
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
            Finances
          </h1>
          <p className="text-warm-white/40 mt-1">
            Financial overview & transaction management
          </p>
        </div>
        <Link href="/admin/finances/new">
          <Button>
            <Plus className="w-4 h-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalIncome)}</p>
          <p className="text-xs text-warm-white/40">Total Income</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-deep-red-light">{formatCurrency(totalExpenses)}</p>
          <p className="text-xs text-warm-white/40">Total Expenses</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className={`text-2xl font-bold ${netProfit >= 0 ? "text-gold" : "text-deep-red-light"}`}>
            {formatCurrency(netProfit)}
          </p>
          <p className="text-xs text-warm-white/40">Net Profit</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-warm-white">
            {formatCurrency(thisMonthIncome - thisMonthExpenses)}
          </p>
          <p className="text-xs text-warm-white/40">This Month</p>
        </Card>
      </div>

      <Card variant="glass" className="p-6 mb-6">
        <h2 className="text-sm font-semibold text-warm-white mb-4">
          Monthly Income vs Expenses ({now.getFullYear()})
        </h2>
        <div className="flex items-end gap-1.5 h-48">
          {monthlyData.map((data, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <div className="w-full flex gap-0.5 items-end" style={{ height: "100%" }}>
                <div
                  className="flex-1 bg-emerald-400/80 rounded-t-sm transition-all duration-300 min-h-[2px]"
                  style={{
                    height: `${(data.income / maxBarValue) * 100}%`,
                  }}
                  title={`Income: ${formatCurrency(data.income)}`}
                />
                <div
                  className="flex-1 bg-deep-red-light/80 rounded-t-sm transition-all duration-300 min-h-[2px]"
                  style={{
                    height: `${(data.expense / maxBarValue) * 100}%`,
                  }}
                  title={`Expenses: ${formatCurrency(data.expense)}`}
                />
              </div>
              <span className="text-[10px] text-warm-white/40">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5 text-xs text-warm-white/50">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400/80" />
            Income
          </div>
          <div className="flex items-center gap-1.5 text-xs text-warm-white/50">
            <div className="w-2.5 h-2.5 rounded-sm bg-deep-red-light/80" />
            Expenses
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card variant="glass" className="p-6">
          <h2 className="text-sm font-semibold text-warm-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Income by Category
          </h2>
          <div className="space-y-3">
            {Object.entries(incomeByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-warm-white/70">
                        {incomeCategories[cat] || cat}
                      </span>
                      <span className="text-warm-white font-medium">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-emerald-400/70"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            {Object.keys(incomeByCategory).length === 0 && (
              <p className="text-sm text-warm-white/40">No income recorded yet</p>
            )}
          </div>
        </Card>

        <Card variant="glass" className="p-6">
          <h2 className="text-sm font-semibold text-warm-white mb-4 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-deep-red-light" />
            Expenses by Category
          </h2>
          <div className="space-y-3">
            {Object.entries(expenseByCategory)
              .sort(([, a], [, b]) => b - a)
              .map(([cat, amount]) => {
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                return (
                  <div key={cat}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-warm-white/70">
                        {expenseCategories[cat] || cat}
                      </span>
                      <span className="text-warm-white font-medium">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="w-full bg-surface rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-deep-red-light/70"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            {Object.keys(expenseByCategory).length === 0 && (
              <p className="text-sm text-warm-white/40">No expenses recorded yet</p>
            )}
          </div>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCategoryFilter("All");
            }}
            className="pl-10 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="All">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="All">All Categories</option>
            {Object.entries(availableCategories).map(([key, val]) => (
              <option key={key} value={key}>
                {val}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <DollarSign className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No transactions found</p>
          <p className="text-warm-white/30 text-sm">
            Record income and expenses to track your finances.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((tx) => {
            const isIncome = tx.type === "income";
            const catLabel = isIncome
              ? incomeCategories[tx.category] || tx.category
              : expenseCategories[tx.category] || tx.category;

            return (
              <Card key={tx.id} variant="glass" className="p-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome ? "bg-emerald-400/10" : "bg-deep-red/10"
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-5 h-5 text-deep-red-light" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-medium text-warm-white text-sm truncate">
                        {tx.description}
                      </h3>
                      <Badge variant={isIncome ? "default" : "red"} size="sm">
                        {catLabel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-warm-white/40">
                      <span>{formatDate(tx.transactionDate)}</span>
                      {tx.paymentMethod && (
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {paymentMethodLabels[tx.paymentMethod] || tx.paymentMethod}
                        </span>
                      )}
                      {tx.reference && <span>Ref: {tx.reference}</span>}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-lg font-bold ${
                        isIncome ? "text-emerald-400" : "text-deep-red-light"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <p className="text-xs text-warm-white/30">{tx.currency}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
