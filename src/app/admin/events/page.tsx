import Link from "next/link";
import { CalendarDays, LayoutGrid, List, Plus, MapPin, DollarSign, Clock, Briefcase, BarChart3, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EventFilters } from "@/components/admin/event-filters";

export const dynamic = "force-dynamic";

const EVENT_STATUSES = [
  "draft", "planning", "proposal", "negotiation", "contract_signed",
  "preparation", "marketing", "production", "live_event", "post_event", "archived",
] as const;

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-warm-white/10 text-warm-white/60 border-warm-white/10",
  planning: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  proposal: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  negotiation: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  contract_signed: "bg-green-500/15 text-green-400 border-green-500/20",
  preparation: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  marketing: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  production: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  live_event: "bg-red-500/15 text-red-400 border-red-500/20",
  post_event: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  archived: "bg-warm-white/10 text-warm-white/40 border-warm-white/10",
};

const CATEGORY_COLORS: Record<string, string> = {
  concert: "bg-gold/15 text-gold border-gold/20",
  wedding: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  corporate: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  festival: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  government: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  university: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  hotel: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  club: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  birthday: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  cultural: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  religious: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  charity: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  private: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-warm-white/10 text-warm-white/50 border-warm-white/10",
  normal: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  high: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  urgent: "bg-red-500/15 text-red-400 border-red-500/20",
};

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === "string" ? params.search : "";
  const category = typeof params.category === "string" ? params.category : "";
  const status = typeof params.status === "string" ? params.status : "";
  const view = typeof params.view === "string" ? params.view : "grid";

  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { venue: { contains: search } },
      { description: { contains: search } },
      { organizer: { contains: search } },
    ];
  }
  if (category) where.category = category;
  if (status) where.status = status;

  const [events, totalEvents, planningCount, inProgressCount, completedCount] = await Promise.all([
    db.event.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    db.event.count(),
    db.event.count({ where: { status: "planning" } }),
    db.event.count({
      where: {
        status: { in: ["preparation", "marketing", "production", "live_event"] },
      },
    }),
    db.event.count({ where: { status: { in: ["post_event", "archived"] } } }),
  ]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Events
          </h1>
          <p className="text-warm-white/40 mt-1">
            Manage all entertainment events and promotions
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="w-4 h-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card variant="glass" className="p-3 text-center">
          <Briefcase className="w-4 h-4 text-warm-white/30 mx-auto mb-1" />
          <p className="text-2xl font-bold text-warm-white">{totalEvents}</p>
          <p className="text-xs text-warm-white/40">Total Events</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <Clock className="w-4 h-4 text-blue-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-blue-400">{planningCount}</p>
          <p className="text-xs text-warm-white/40">Planning</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <BarChart3 className="w-4 h-4 text-amber-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-amber-400">{inProgressCount}</p>
          <p className="text-xs text-warm-white/40">In Progress</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-emerald-400">{completedCount}</p>
          <p className="text-xs text-warm-white/40">Completed</p>
        </Card>
      </div>

      <EventFilters search={search} category={category} status={status} view={view} />

      {events.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <CalendarDays className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No events found</p>
          <p className="text-warm-white/30 text-sm mb-6">
            {search || category || status
              ? "Try adjusting your filters or search query."
              : "Create your first event to get started."}
          </p>
          {!search && !category && !status && (
            <Button asChild>
              <Link href="/admin/events/new">
                <Plus className="w-4 h-4" />
                Create Event
              </Link>
            </Button>
          )}
        </Card>
      ) : view === "list" ? (
        <Card variant="bordered" padding="none">
          <div className="divide-y divide-border">
            {events.map((event) => {
              const budgetPercent = event.budget > 0
                ? Math.round((event.estimatedCost / event.budget) * 100)
                : 0;
              return (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-surface-lighter/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-warm-white truncate">{event.name}</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap ${STATUS_STYLES[event.status] || STATUS_STYLES.draft}`}>
                        {statusLabel(event.status)}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap ${PRIORITY_STYLES[event.priority] || PRIORITY_STYLES.normal}`}>
                        {statusLabel(event.priority)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warm-white/50">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${CATEGORY_COLORS[event.category] || "bg-warm-white/10 text-warm-white/50 border-warm-white/10"}`}>
                        {statusLabel(event.category)}
                      </span>
                      {event.eventDate && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {formatDate(event.eventDate)}
                        </span>
                      )}
                      {event.venue && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.venue}
                        </span>
                      )}
                      {event.budget > 0 && (
                        <span className="flex items-center gap-1 text-gold">
                          <DollarSign className="w-3 h-3" />
                          {formatCurrency(event.budget)}
                        </span>
                      )}
                    </div>
                  </div>
                  {event.budget > 0 && (
                    <div className="text-right shrink-0 hidden sm:block">
                      <p className="text-xs text-warm-white/40 mb-1">{budgetPercent}% spent</p>
                      <div className="w-24 h-1.5 rounded-full bg-surface-lighter overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${budgetPercent > 90 ? "bg-red-500" : budgetPercent > 70 ? "bg-amber-500" : "bg-gold"}`}
                          style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map((event) => {
            const taskCount = 0;
            const budgetPercent = event.budget > 0
              ? Math.round((event.estimatedCost / event.budget) * 100)
              : 0;
            return (
              <Link key={event.id} href={`/admin/events/${event.id}`}>
                <Card variant="hover" className="h-full flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap ${STATUS_STYLES[event.status] || STATUS_STYLES.draft}`}>
                      {statusLabel(event.status)}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap ${PRIORITY_STYLES[event.priority] || PRIORITY_STYLES.normal}`}>
                      {statusLabel(event.priority)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-warm-white mb-1 line-clamp-1">{event.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border whitespace-nowrap self-start mb-3 ${CATEGORY_COLORS[event.category] || "bg-warm-white/10 text-warm-white/50 border-warm-white/10"}`}>
                    {statusLabel(event.category)}
                  </span>
                  <div className="mt-auto space-y-2 text-xs text-warm-white/50">
                    {event.eventDate && (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-3.5 h-3.5 shrink-0" />
                        <span>{formatDate(event.eventDate)}</span>
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                    {event.budget > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5 shrink-0 text-gold" />
                        <span className="text-gold font-medium">{formatCurrency(event.budget)}</span>
                        <span className="text-warm-white/30 ml-auto">est. {formatCurrency(event.estimatedCost)}</span>
                      </div>
                    )}
                    {event.budget > 0 && (
                      <div className="pt-1">
                        <div className="flex justify-between text-[10px] text-warm-white/30 mb-1">
                          <span>Budget usage</span>
                          <span>{budgetPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-surface-lighter overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${budgetPercent > 90 ? "bg-red-500" : budgetPercent > 70 ? "bg-amber-500" : "bg-gold"}`}
                            style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
