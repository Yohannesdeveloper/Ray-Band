import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  CalendarDays,
  Handshake,
  CalendarCheck,
  Clock,
  Building2,
  AlertCircle,
  FileText,
  Shield,
  Users,
  UserCheck,
  CalendarPlus,
  UserPlus,
  Send,
  BarChart3,
  UserCog,
  FolderOpen,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const startOfMonth = new Date(currentYear, currentMonth, 1);
  const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
  const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  let totalRevenue = { _sum: { amount: null as number | null } };
  let monthlyRevenue = { _sum: { amount: null as number | null } };
  let totalEvents = 0;
  let activeSponsors = 0;
  let pendingBookings = 0;
  let upcomingEvents = 0;
  let partnershipPipeline = 0;
  let outstandingPayments = { _sum: { amount: null as number | null } };
  let activeProposals = 0;
  let expiringDocs = 0;
  let activeTeamMembers = 0;
  let uniqueClients: { contactEmail: string }[] = [];
  let monthlyRevenueData: { _sum: { amount: number | null } }[] = Array.from({ length: 12 }, () => ({ _sum: { amount: null } }));
  let eventCategories: { category: string; _count: { id: number } }[] = [];
  let sponsorsByStage: { status: string; _count: { id: number } }[] = [];
  let recentEvents: { id: string; name: string; category: string; eventDate: Date | null; status: string; budget: number }[] = [];
  let recentAuditLogs: { id: string; action: string; entity: string | null; createdAt: Date; details: string | null }[] = [];

  try {
    [
      totalRevenue,
      monthlyRevenue,
      totalEvents,
      activeSponsors,
      pendingBookings,
      upcomingEvents,
      partnershipPipeline,
      outstandingPayments,
      activeProposals,
      expiringDocs,
      activeTeamMembers,
      uniqueClients,
      monthlyRevenueData,
      eventCategories,
      sponsorsByStage,
      recentEvents,
      recentAuditLogs,
    ] = await Promise.all([
      db.financialTransaction.aggregate({
        where: { type: "income" },
        _sum: { amount: true },
      }),
      db.financialTransaction.aggregate({
        where: {
          type: "income",
          transactionDate: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      }),
      db.event.count(),
      db.sponsor.count({ where: { status: "active" } }),
      db.booking.count({ where: { status: "pending" } }),
      db.event.count({
        where: {
          eventDate: { gte: now, lte: thirtyDaysLater },
          status: { notIn: ["archived", "post_event"] },
        },
      }),
      db.partnership.count({
        where: { status: { notIn: ["inactive", "expired"] } },
      }),
      db.financialTransaction.aggregate({
        where: { type: "expense", notes: { contains: "pending" } },
        _sum: { amount: true },
      }),
      db.proposal.count({
        where: { status: { in: ["draft", "sent"] } },
      }),
      db.legalDocument.count({
        where: {
          expirationDate: { gte: now, lte: thirtyDaysLater },
          status: { notIn: ["expired", "archived"] },
        },
      }),
      db.staffMember.count({ where: { isActive: true } }),
      db.booking.findMany({
        select: { contactEmail: true },
        distinct: ["contactEmail"],
      }),
      Promise.all(
        Array.from({ length: 12 }, (_, i) => {
          const monthStart = new Date(currentYear, i, 1);
          const monthEnd = new Date(currentYear, i + 1, 0, 23, 59, 59);
          return db.financialTransaction.aggregate({
            where: {
              type: "income",
              transactionDate: { gte: monthStart, lte: monthEnd },
            },
            _sum: { amount: true },
          });
        })
      ),
      db.event.groupBy({
        by: ["category"],
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
      }),
      db.sponsor.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      db.event.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          category: true,
          eventDate: true,
          status: true,
          budget: true,
        },
      }),
      db.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          action: true,
          entity: true,
          createdAt: true,
          details: true,
        },
      }),
    ]);
  } catch (err) {
    console.error("Dashboard data fetch error:", err);
  }

  const totalRevenueValue = totalRevenue._sum.amount ?? 0;
  const monthlyRevenueValue = monthlyRevenue._sum.amount ?? 0;
  const outstandingPaymentsValue = outstandingPayments._sum.amount ?? 0;
  const totalClientsCount = uniqueClients.length;

  const maxMonthlyRevenue = Math.max(
    ...monthlyRevenueData.map((m) => m._sum.amount ?? 0),
    1
  );

  const maxCategoryCount = Math.max(
    ...eventCategories.map((c) => c._count.id),
    1
  );

  const pipelineStages = [
    { key: "prospect", label: "Prospects", color: "bg-warm-white/20" },
    { key: "initial_contact", label: "Contacted", color: "bg-cyan-400/40" },
    { key: "discovery_meeting", label: "Meetings", color: "bg-blue-400/40" },
    { key: "proposal_sent", label: "Proposals", color: "bg-violet-400/40" },
    { key: "negotiation", label: "Negotiating", color: "bg-amber-400/40" },
    { key: "approved", label: "Approved", color: "bg-emerald-400/40" },
    { key: "active", label: "Active", color: "bg-gold/40" },
  ];

  const stageData = pipelineStages.map((stage) => ({
    ...stage,
    count: sponsorsByStage.find((s) => s.status === stage.key)?._count.id ?? 0,
  }));

  const maxStageCount = Math.max(...stageData.map((s) => s.count), 1);

  const actionIcons: Record<string, string> = {
    create: "text-emerald-400",
    update: "text-blue-400",
    delete: "text-red-400",
    login: "text-violet-400",
    export: "text-amber-400",
    upload: "text-cyan-400",
    approve: "text-gold",
  };

  const kpiRow1 = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenueValue),
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
      borderColor: "border-emerald-400/20",
    },
    {
      label: "Monthly Revenue",
      value: formatCurrency(monthlyRevenueValue),
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20",
    },
    {
      label: "Total Events",
      value: totalEvents.toString(),
      icon: CalendarDays,
      color: "text-violet-400",
      bgColor: "bg-violet-400/10",
      borderColor: "border-violet-400/20",
    },
    {
      label: "Active Sponsors",
      value: activeSponsors.toString(),
      icon: Handshake,
      color: "text-gold",
      bgColor: "bg-gold/10",
      borderColor: "border-gold/20",
    },
  ];

  const kpiRow2 = [
    {
      label: "Pending Bookings",
      value: pendingBookings.toString(),
      icon: CalendarCheck,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
    },
    {
      label: "Upcoming Events",
      value: upcomingEvents.toString(),
      icon: Clock,
      color: "text-cyan-400",
      bgColor: "bg-cyan-400/10",
      borderColor: "border-cyan-400/20",
    },
    {
      label: "Partnership Pipeline",
      value: partnershipPipeline.toString(),
      icon: Building2,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
      borderColor: "border-pink-400/20",
    },
    {
      label: "Outstanding Payments",
      value: formatCurrency(outstandingPaymentsValue),
      icon: AlertCircle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      borderColor: "border-red-400/20",
    },
  ];

  const kpiRow3 = [
    {
      label: "Active Proposals",
      value: activeProposals.toString(),
      icon: FileText,
      color: "text-indigo-400",
      bgColor: "bg-indigo-400/10",
      borderColor: "border-indigo-400/20",
    },
    {
      label: "Legal Docs Expiring",
      value: expiringDocs.toString(),
      icon: Shield,
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20",
    },
    {
      label: "Team Members",
      value: activeTeamMembers.toString(),
      icon: Users,
      color: "text-teal-400",
      bgColor: "bg-teal-400/10",
      borderColor: "border-teal-400/20",
    },
    {
      label: "Total Clients",
      value: totalClientsCount.toString(),
      icon: UserCheck,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20",
    },
  ];

  const quickActions = [
    { label: "Create Event", href: "/admin/events/new", icon: CalendarPlus, color: "text-violet-400", bgColor: "bg-violet-400/10" },
    { label: "New Sponsor", href: "/admin/sponsors/new", icon: UserPlus, color: "text-gold", bgColor: "bg-gold/10" },
    { label: "Generate Proposal", href: "/admin/proposals/new", icon: Send, color: "text-blue-400", bgColor: "bg-blue-400/10" },
    { label: "View Reports", href: "/admin/reports", icon: BarChart3, color: "text-emerald-400", bgColor: "bg-emerald-400/10" },
    { label: "Manage Team", href: "/admin/team", icon: UserCog, color: "text-teal-400", bgColor: "bg-teal-400/10" },
    { label: "Legal Docs", href: "/admin/legal", icon: FolderOpen, color: "text-orange-400", bgColor: "bg-orange-400/10" },
  ];

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function getEventStatusVariant(status: string) {
    switch (status) {
      case "live_event":
      case "production":
        return "gold" as const;
      case "planning":
      case "preparation":
        return "default" as const;
      case "draft":
        return "outline" as const;
      case "archived":
      case "post_event":
        return "glass" as const;
      default:
        return "default" as const;
    }
  }

  function formatStatusLabel(status: string) {
    return status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
          Executive Dashboard
        </h1>
        <p className="text-warm-white/40 mt-1">
          Ray Entertainment & Promotion — Real-time business intelligence
        </p>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {kpiRow1.map((stat) => (
          <Card key={stat.label} variant="glass" className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-warm-white/40">{stat.label}</p>
                <p className="text-2xl font-bold text-warm-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {kpiRow2.map((stat) => (
          <Card key={stat.label} variant="glass" className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-warm-white/40">{stat.label}</p>
                <p className="text-2xl font-bold text-warm-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* KPI Row 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpiRow3.map((stat) => (
          <Card key={stat.label} variant="glass" className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-warm-white/40">{stat.label}</p>
                <p className="text-2xl font-bold text-warm-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Revenue Overview Bar Chart */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-warm-white">Revenue Overview</h2>
              <p className="text-sm text-warm-white/40">Monthly income for {currentYear}</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="h-56 flex items-end gap-1.5">
            {monthlyRevenueData.map((m, i) => {
              const amount = m._sum.amount ?? 0;
              const heightPercent = maxMonthlyRevenue > 0 ? (amount / maxMonthlyRevenue) * 100 : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="relative w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-warm-white/70 bg-charcoal-lighter px-1.5 py-0.5 rounded">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500/30 to-emerald-400 rounded-t-sm transition-all duration-300 hover:from-emerald-500/50 hover:to-emerald-300 cursor-pointer min-h-[2px]"
                    style={{ height: `${Math.max(heightPercent, 2)}%` }}
                  />
                  <span className="text-[10px] text-warm-white/30">{months[i]}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Event Categories Horizontal Bar Chart */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-warm-white">Event Categories</h2>
              <p className="text-sm text-warm-white/40">Distribution by type</p>
            </div>
            <CalendarDays className="w-5 h-5 text-violet-400" />
          </div>
          <div className="space-y-3">
            {eventCategories.length === 0 ? (
              <div className="text-center py-8">
                <CalendarDays className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
                <p className="text-warm-white/30 text-sm">No events yet</p>
              </div>
            ) : (
              eventCategories.slice(0, 7).map((cat) => {
                const widthPercent = (cat._count.id / maxCategoryCount) * 100;
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-warm-white/70 capitalize">
                        {cat.category.replace(/_/g, " ")}
                      </span>
                      <span className="text-sm font-medium text-warm-white">{cat._count.id}</span>
                    </div>
                    <div className="w-full h-2 bg-charcoal-lighter rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500/60 to-violet-400 rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Sponsorship Pipeline */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-warm-white">Sponsorship Pipeline</h2>
              <p className="text-sm text-warm-white/40">Sponsors by pipeline stage</p>
            </div>
            <Handshake className="w-5 h-5 text-gold" />
          </div>
          <div className="space-y-3">
            {stageData.map((stage) => {
              const widthPercent = (stage.count / maxStageCount) * 100;
              return (
                <div key={stage.key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-warm-white/70">{stage.label}</span>
                    <span className="text-sm font-medium text-warm-white">{stage.count}</span>
                  </div>
                  <div className="w-full h-2.5 bg-charcoal-lighter rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(widthPercent, stage.count > 0 ? 8 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Activity Timeline */}
        <Card variant="glass" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-warm-white">Recent Activity</h2>
              <p className="text-sm text-warm-white/40">Latest system actions</p>
            </div>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-4">
            {recentAuditLogs.length === 0 ? (
              <div className="text-center py-8">
                <Activity className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
                <p className="text-warm-white/30 text-sm">No activity recorded yet</p>
              </div>
            ) : (
              recentAuditLogs.map((log, i) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        actionIcons[log.action] ?? "text-warm-white/30"
                      } bg-current`}
                    />
                    {i < recentAuditLogs.length - 1 && (
                      <div className="w-px h-6 bg-warm-white/10 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-warm-white capitalize">
                        {log.action}
                      </span>
                      <span className="text-xs text-warm-white/30">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-warm-white/40 mt-0.5 capitalize">
                      {log.entity?.replace(/_/g, " ") ?? "System"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card variant="glass" className="p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-warm-white">Quick Actions</h2>
          <p className="text-sm text-warm-white/40">Common tasks and shortcuts</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <a key={action.label} href={action.href} className="group">
              <div className="flex flex-col items-center gap-2.5 p-4 rounded-xl bg-charcoal-lighter/50 border border-border hover:border-gold/30 hover:bg-surface-lighter transition-all duration-300">
                <div className={`p-2.5 rounded-lg ${action.bgColor}`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-warm-white/70 group-hover:text-warm-white transition-colors text-center">
                  {action.label}
                </span>
              </div>
            </a>
          ))}
        </div>
      </Card>

      {/* Recent Events Table */}
      <Card variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-warm-white">Recent Events</h2>
            <p className="text-sm text-warm-white/40">Latest event submissions</p>
          </div>
          <Link
            href="/admin/events"
            className="text-sm text-gold hover:text-gold/80 transition-colors flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        {recentEvents.length === 0 ? (
          <div className="text-center py-8">
            <CalendarDays className="w-10 h-10 text-warm-white/10 mx-auto mb-3" />
            <p className="text-warm-white/30 text-sm">No events yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3 pr-4">
                    Event Name
                  </th>
                  <th className="text-left text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3 pr-4">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3 pr-4">
                    Date
                  </th>
                  <th className="text-left text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3 pr-4">
                    Status
                  </th>
                  <th className="text-right text-xs font-medium text-warm-white/40 uppercase tracking-wider pb-3">
                    Budget
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-border/50 last:border-0 hover:bg-surface-lighter/50 transition-colors"
                  >
                    <td className="py-3.5 pr-4">
                      <span className="text-sm font-medium text-warm-white">
                        {event.name}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-sm text-warm-white/60 capitalize">
                        {event.category.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="text-sm text-warm-white/60">
                        {event.eventDate ? formatDate(event.eventDate) : "—"}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4">
                      <Badge variant={getEventStatusVariant(event.status)} size="sm">
                        {formatStatusLabel(event.status)}
                      </Badge>
                    </td>
                    <td className="py-3.5 text-right">
                      <span className="text-sm font-medium text-warm-white">
                        {formatCurrency(event.budget)}
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
