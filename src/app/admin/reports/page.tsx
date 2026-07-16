import {
  DollarSign, CalendarDays, Handshake, Users, UserCog,
  FileText, TrendingUp, BarChart3, Download, Calendar,
  ArrowUpRight, Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const [
    totalRevenue,
    totalExpenses,
    monthlyRevenue,
    totalEvents,
    completedEvents,
    upcomingEvents,
    activeSponsors,
    totalSponsorships,
    totalPartnerships,
    activePartnerships,
    totalBookings,
    confirmedBookings,
    totalTeam,
    activeTeam,
    recentTransactions,
    recentEvents,
    upcomingEventsList,
    eventsByStatus,
    topSponsors,
  ] = await Promise.all([
    db.financialTransaction.aggregate({
      where: { type: "income", transactionDate: { gte: startOfYear, lte: endOfYear } },
      _sum: { amount: true },
      _count: { id: true },
    }),
    db.financialTransaction.aggregate({
      where: { type: "expense", transactionDate: { gte: startOfYear, lte: endOfYear } },
      _sum: { amount: true },
      _count: { id: true },
    }),
    db.financialTransaction.aggregate({
      where: { type: "income", transactionDate: { gte: startOfMonth, lte: now } },
      _sum: { amount: true },
    }),
    db.event.count(),
    db.event.count({ where: { status: { in: ["post_event", "archived"] } } }),
    db.event.count({ where: { eventDate: { gte: now, lte: thirtyDaysLater } } }),
    db.sponsor.count({ where: { status: "active" } }),
    db.sponsorship.aggregate({ _sum: { amount: true }, _count: { id: true } }),
    db.partnership.count(),
    db.partnership.count({ where: { status: "active" } }),
    db.booking.count(),
    db.booking.count({ where: { status: { in: ["confirmed", "completed"] } } }),
    db.staffMember.count(),
    db.staffMember.count({ where: { isActive: true } }),
    db.financialTransaction.findMany({
      orderBy: { transactionDate: "desc" },
      take: 5,
      select: {
        id: true,
        type: true,
        category: true,
        description: true,
        amount: true,
        transactionDate: true,
      },
    }),
    db.event.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        category: true,
        status: true,
        budget: true,
        eventDate: true,
      },
    }),
    db.event.findMany({
      where: { eventDate: { gte: now, lte: thirtyDaysLater } },
      orderBy: { eventDate: "asc" },
      take: 5,
      select: {
        id: true,
        name: true,
        eventDate: true,
        venue: true,
        status: true,
        budget: true,
      },
    }),
    db.event.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    db.sponsor.findMany({
      where: { status: "active" },
      orderBy: { totalValue: "desc" },
      take: 5,
      select: {
        id: true,
        companyName: true,
        industry: true,
        totalValue: true,
        status: true,
      },
    }),
  ]);

  const totalRevenueValue = totalRevenue._sum.amount ?? 0;
  const totalExpensesValue = totalExpenses._sum.amount ?? 0;
  const netProfit = totalRevenueValue - totalExpensesValue;
  const profitMargin = totalRevenueValue > 0 ? ((netProfit / totalRevenueValue) * 100).toFixed(1) : "0";
  const monthlyRevenueValue = monthlyRevenue._sum.amount ?? 0;
  const sponsorshipValue = totalSponsorships._sum.amount ?? 0;

  const reportTypes = [
    {
      id: "financial",
      title: "Financial Summary",
      description: "Revenue, expenses, profit margins, and financial health",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
      stats: [
        { label: "Total Revenue", value: formatCurrency(totalRevenueValue) },
        { label: "Total Expenses", value: formatCurrency(totalExpensesValue) },
        { label: "Net Profit", value: formatCurrency(netProfit) },
        { label: "Profit Margin", value: `${profitMargin}%` },
      ],
    },
    {
      id: "events",
      title: "Event Performance",
      description: "Event metrics, completion rates, and upcoming pipeline",
      icon: CalendarDays,
      color: "text-violet-400",
      bgColor: "bg-violet-400/10",
      borderColor: "border-violet-400/20",
      stats: [
        { label: "Total Events", value: totalEvents.toString() },
        { label: "Completed", value: completedEvents.toString() },
        { label: "Upcoming (30d)", value: upcomingEvents.toString() },
        { label: "Total Bookings", value: totalBookings.toString() },
      ],
    },
    {
      id: "sponsorship",
      title: "Sponsorship Report",
      description: "Sponsor pipeline, deals, and sponsorship revenue",
      icon: Handshake,
      color: "text-gold",
      bgColor: "bg-gold/10",
      borderColor: "border-gold/20",
      stats: [
        { label: "Active Sponsors", value: activeSponsors.toString() },
        { label: "Total Sponsorships", value: totalSponsorships._count.id.toString() },
        { label: "Sponsorship Value", value: formatCurrency(sponsorshipValue) },
        { label: "Active Partnerships", value: activePartnerships.toString() },
      ],
    },
    {
      id: "clients",
      title: "Client Report",
      description: "Client demographics, satisfaction, and booking trends",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
      stats: [
        { label: "Total Bookings", value: totalBookings.toString() },
        { label: "Confirmed", value: confirmedBookings.toString() },
        { label: "Conversion Rate", value: totalBookings > 0 ? `${((confirmedBookings / totalBookings) * 100).toFixed(0)}%` : "0%" },
        { label: "Avg. Booking Value", value: totalBookings > 0 ? formatCurrency(totalRevenueValue / totalBookings) : formatCurrency(0) },
      ],
    },
    {
      id: "team",
      title: "Team Performance",
      description: "Team metrics, task completion, and productivity",
      icon: UserCog,
      color: "text-teal-400",
      bgColor: "bg-teal-400/10",
      borderColor: "border-teal-400/20",
      stats: [
        { label: "Total Team", value: totalTeam.toString() },
        { label: "Active Members", value: activeTeam.toString() },
        { label: "Events/Member", value: activeTeam > 0 ? (totalEvents / activeTeam).toFixed(1) : "0" },
        { label: "Revenue/Member", value: activeTeam > 0 ? formatCurrency(totalRevenueValue / activeTeam) : formatCurrency(0) },
      ],
    },
    {
      id: "monthly",
      title: "Monthly Report",
      description: "Month-over-month comparison and trend analysis",
      icon: BarChart3,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
      borderColor: "border-pink-400/20",
      stats: [
        { label: "Month Revenue", value: formatCurrency(monthlyRevenueValue) },
        { label: "Upcoming Events", value: upcomingEvents.toString() },
        { label: "Total Transactions", value: (totalRevenue._count.id + totalExpenses._count.id).toString() },
        { label: "Partnership Pipeline", value: totalPartnerships.toString() },
      ],
    },
  ];

  function getStatusVariant(status: string) {
    switch (status) {
      case "live_event":
      case "production":
        return "gold" as const;
      case "completed":
      case "post_event":
        return "default" as const;
      case "draft":
        return "outline" as const;
      case "planning":
        return "glass" as const;
      default:
        return "default" as const;
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Reports
          </h1>
          <p className="text-warm-white/40 mt-1">
            Business intelligence and performance analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-light border border-border">
            <Calendar className="w-4 h-4 text-warm-white/40" />
            <span className="text-sm text-warm-white/70">
              {formatDate(startOfYear)} — {formatDate(endOfYear)}
            </span>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Annual Revenue",
            value: formatCurrency(totalRevenueValue),
            icon: TrendingUp,
            color: "text-emerald-400",
            bgColor: "bg-emerald-400/10",
          },
          {
            label: "Net Profit",
            value: formatCurrency(netProfit),
            icon: DollarSign,
            color: netProfit >= 0 ? "text-emerald-400" : "text-red-400",
            bgColor: netProfit >= 0 ? "bg-emerald-400/10" : "bg-red-400/10",
          },
          {
            label: "Active Sponsors",
            value: activeSponsors.toString(),
            icon: Handshake,
            color: "text-gold",
            bgColor: "bg-gold/10",
          },
          {
            label: "Total Events",
            value: totalEvents.toString(),
            icon: CalendarDays,
            color: "text-violet-400",
            bgColor: "bg-violet-400/10",
          },
        ].map((stat) => (
          <Card key={stat.label} variant="glass" className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-warm-white/40">{stat.label}</p>
                <p className="text-2xl font-bold text-warm-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-warm-white mb-4">Available Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => (
            <Card key={report.id} variant="glass" className="p-0">
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${report.bgColor} border ${report.borderColor}`}>
                    <report.icon className={`w-5 h-5 ${report.color}`} />
                  </div>
                  <Badge variant="gold" size="sm">
                    Ready
                  </Badge>
                </div>
                <h3 className="font-bold text-warm-white mb-1">{report.title}</h3>
                <p className="text-sm text-warm-white/40 mb-4">{report.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {report.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-xs text-warm-white/30">{stat.label}</p>
                      <p className="text-sm font-medium text-warm-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart3 className="w-4 h-4" /> Generate Report
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Recent Transactions */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-warm-white">Recent Transactions</h2>
              <p className="text-sm text-warm-white/40">Latest financial activity</p>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          {recentTransactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/30 text-sm">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-light/50 border border-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        t.type === "income"
                          ? "bg-emerald-400/10 text-emerald-400"
                          : "bg-red-400/10 text-red-400"
                      }`}
                    >
                      {t.type === "income" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 rotate-90" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-warm-white">{t.description}</p>
                      <p className="text-xs text-warm-white/40 capitalize">
                        {t.category.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        t.type === "income" ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </p>
                    <p className="text-xs text-warm-white/30 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {formatDate(t.transactionDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Upcoming Events */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-warm-white">Upcoming Events</h2>
              <p className="text-sm text-warm-white/40">Next 30 days</p>
            </div>
            <CalendarDays className="w-5 h-5 text-violet-400" />
          </div>
          {upcomingEventsList.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
              <p className="text-warm-white/30 text-sm">No upcoming events</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingEventsList.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-light/50 border border-border/50"
                >
                  <div>
                    <p className="text-sm font-medium text-warm-white">{event.name}</p>
                    <p className="text-xs text-warm-white/40">
                      {event.eventDate ? formatDate(event.eventDate) : "TBD"}{" "}
                      {event.venue && `• ${event.venue}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusVariant(event.status)} size="sm">
                      {event.status.replace(/_/g, " ")}
                    </Badge>
                    <p className="text-xs text-warm-white/40 mt-1">
                      {formatCurrency(event.budget)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Top Sponsors */}
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-warm-white">Top Sponsors</h2>
            <p className="text-sm text-warm-white/40">Active sponsor partnerships</p>
          </div>
          <Handshake className="w-5 h-5 text-gold" />
        </div>
        {topSponsors.length === 0 ? (
          <div className="text-center py-8">
            <Handshake className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
            <p className="text-warm-white/30 text-sm">No active sponsors</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3 pr-4">
                    Company
                  </th>
                  <th className="text-left text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3 pr-4">
                    Industry
                  </th>
                  <th className="text-left text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3 pr-4">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3">
                    Total Value
                  </th>
                </tr>
              </thead>
              <tbody>
                {topSponsors.map((sponsor) => (
                  <tr
                    key={sponsor.id}
                    className="border-b border-border/50 last:border-0 hover:bg-surface-lighter/50 transition-colors"
                  >
                    <td className="py-3.5 pr-4">
                      <span className="text-sm font-medium text-warm-white">
                        {sponsor.companyName}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-sm text-warm-white/60">
                        {sponsor.industry || "—"}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant="gold" size="sm">
                        {sponsor.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="text-sm font-medium text-warm-white">
                        {formatCurrency(sponsor.totalValue)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
