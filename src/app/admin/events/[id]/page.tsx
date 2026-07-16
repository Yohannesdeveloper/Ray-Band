import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Edit, Calendar, MapPin, DollarSign, Users, Clock,
  CheckCircle2, AlertCircle, FileText, Image, Wrench, Phone,
  Mail, Tag, BarChart3, Ticket,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-warm-white/10 text-warm-white/50 border-warm-white/10",
  normal: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  high: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  urgent: "bg-red-500/15 text-red-400 border-red-500/20",
};

const TASK_STATUS_STYLES: Record<string, string> = {
  pending: "bg-warm-white/10 text-warm-white/60 border-warm-white/10",
  in_progress: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  blocked: "bg-red-500/15 text-red-400 border-red-500/20",
};

const EXPENSE_STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  approved: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  paid: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/15 text-red-400 border-red-500/20",
};

function statusLabel(s: string) {
  return s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const tab = typeof sp.tab === "string" ? sp.tab : "overview";

  const event = await db.event.findUnique({
    where: { id },
    include: {
      tasks: { orderBy: { createdAt: "desc" } },
      expenses: { orderBy: { createdAt: "desc" } },
      eventMedia: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!event) notFound();

  const totalExpenses = event.expenses.reduce((sum, e) => sum + e.amount, 0);
  const approvedExpenses = event.expenses
    .filter((e) => e.status === "approved" || e.status === "paid")
    .reduce((sum, e) => sum + e.amount, 0);
  const completedTasks = event.tasks.filter((t) => t.status === "completed").length;
  const totalTasks = event.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "tasks", label: "Tasks", icon: CheckCircle2, count: totalTasks },
    { id: "expenses", label: "Expenses", icon: DollarSign, count: event.expenses.length },
    { id: "media", label: "Media", icon: Image, count: event.eventMedia.length },
    { id: "technical", label: "Technical", icon: Wrench },
  ];

  const budgetPercent = event.budget > 0 ? Math.round((event.estimatedCost / event.budget) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/events"
          className="flex items-center gap-2 text-warm-white/40 hover:text-warm-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
              {event.name}
            </h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap ${STATUS_STYLES[event.status] || STATUS_STYLES.draft}`}>
              {statusLabel(event.status)}
            </span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border whitespace-nowrap ${PRIORITY_STYLES[event.priority] || PRIORITY_STYLES.normal}`}>
              {statusLabel(event.priority)}
            </span>
          </div>
          <p className="text-warm-white/40 text-sm">
            {statusLabel(event.category)} event
            {event.eventDate && <> &middot; {formatDate(event.eventDate)}</>}
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href={`/admin/events/${event.id}/edit`}>
            <Edit className="w-4 h-4" />
            Edit Event
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.id}
              href={`/admin/events/${event.id}?tab=${t.id}`}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                tab === t.id
                  ? "bg-gold/20 text-gold border border-gold/30"
                  : "bg-surface-light text-warm-white/40 border border-border hover:text-warm-white hover:bg-surface-lighter"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
              {t.count !== undefined && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full bg-warm-white/10 text-[10px]">
                  {t.count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {event.description && (
              <Card variant="bordered" padding="md">
                <h3 className="text-sm font-semibold text-warm-white mb-3">Description</h3>
                <p className="text-sm text-warm-white/60 whitespace-pre-wrap">{event.description}</p>
              </Card>
            )}

            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-4">Event Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.venue && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-warm-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-warm-white/40">Venue</p>
                      <p className="text-sm text-warm-white">{event.venue}</p>
                      {event.venueAddress && (
                        <p className="text-xs text-warm-white/40">{event.venueAddress}</p>
                      )}
                    </div>
                  </div>
                )}
                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-warm-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-warm-white/40">Capacity</p>
                      <p className="text-sm text-warm-white">{event.capacity.toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {event.eventDate && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-warm-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-warm-white/40">Date</p>
                      <p className="text-sm text-warm-white">{formatDate(event.eventDate)}</p>
                      {event.eventEndDate && (
                        <p className="text-xs text-warm-white/40">to {formatDate(event.eventEndDate)}</p>
                      )}
                    </div>
                  </div>
                )}
                {(event.startTime || event.endTime) && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-warm-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-warm-white/40">Time</p>
                      <p className="text-sm text-warm-white">
                        {event.startTime || "—"} {event.endTime ? `to ${event.endTime}` : ""}
                      </p>
                    </div>
                  </div>
                )}
                {event.rehearsalDate && (
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-warm-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-warm-white/40">Rehearsal</p>
                      <p className="text-sm text-warm-white">{formatDate(event.rehearsalDate)}</p>
                      {event.rehearsalTime && (
                        <p className="text-xs text-warm-white/40">at {event.rehearsalTime}</p>
                      )}
                    </div>
                  </div>
                )}
                {event.transportation && (
                  <div className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-warm-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-warm-white/40">Transportation</p>
                      <p className="text-sm text-warm-white">{event.transportation}</p>
                    </div>
                  </div>
                )}
                {event.accommodation && (
                  <div className="flex items-start gap-3">
                    <Tag className="w-4 h-4 text-warm-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-warm-white/40">Accommodation</p>
                      <p className="text-sm text-warm-white">{event.accommodation}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {(event.contactName || event.contactEmail || event.contactPhone) && (
              <Card variant="bordered" padding="md">
                <h3 className="text-sm font-semibold text-warm-white mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {event.contactName && (
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-warm-white/30 shrink-0" />
                      <span className="text-sm text-warm-white">{event.contactName}</span>
                    </div>
                  )}
                  {event.contactEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-warm-white/30 shrink-0" />
                      <span className="text-sm text-warm-white">{event.contactEmail}</span>
                    </div>
                  )}
                  {event.contactPhone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-warm-white/30 shrink-0" />
                      <span className="text-sm text-warm-white">{event.contactPhone}</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {event.notes && (
              <Card variant="bordered" padding="md">
                <h3 className="text-sm font-semibold text-warm-white mb-3">Notes</h3>
                <p className="text-sm text-warm-white/60 whitespace-pre-wrap">{event.notes}</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-4">Budget Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-warm-white/50">Budget</span>
                    <span className="text-warm-white font-medium">{formatCurrency(event.budget)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-warm-white/50">Estimated Cost</span>
                    <span className="text-warm-white font-medium">{formatCurrency(event.estimatedCost)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-warm-white/50">Actual Expenses</span>
                    <span className="text-gold font-medium">{formatCurrency(totalExpenses)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-warm-white/50">Revenue Projection</span>
                    <span className="text-emerald-400 font-medium">{formatCurrency(event.revenueProjection)}</span>
                  </div>
                </div>
                {event.budget > 0 && (
                  <div>
                    <div className="flex justify-between text-xs text-warm-white/30 mb-1">
                      <span>Budget usage</span>
                      <span>{budgetPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-surface-lighter overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${budgetPercent > 90 ? "bg-red-500" : budgetPercent > 70 ? "bg-amber-500" : "bg-gold"}`}
                        style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {event.ticketPrice && (
              <Card variant="bordered" padding="md">
                <h3 className="text-sm font-semibold text-warm-white mb-3">Tickets</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-gold" />
                    <span className="text-sm text-warm-white font-medium">{formatCurrency(event.ticketPrice)}</span>
                  </div>
                  {event.ticketType && (
                    <p className="text-xs text-warm-white/40 capitalize">{event.ticketType.replace(/_/g, " ")}</p>
                  )}
                </div>
              </Card>
            )}

            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-3">Progress</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full h-2 rounded-full bg-surface-lighter overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-warm-white font-medium">{progress}%</span>
              </div>
              <p className="text-xs text-warm-white/30 mt-2">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </Card>

            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-white/50">Expenses</span>
                  <span className="text-warm-white">{event.expenses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-white/50">Media Files</span>
                  <span className="text-warm-white">{event.eventMedia.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-white/50">Created</span>
                  <span className="text-warm-white">{formatDate(event.createdAt)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {tab === "tasks" && (
        <div>
          {event.tasks.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <CheckCircle2 className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
              <p className="text-warm-white/40 text-lg mb-2">No tasks yet</p>
              <p className="text-warm-white/30 text-sm">Tasks will appear here once created for this event.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {event.tasks.map((task) => (
                <Card key={task.id} variant="glass" className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-warm-white text-sm">{task.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border whitespace-nowrap ${TASK_STATUS_STYLES[task.status] || TASK_STATUS_STYLES.pending}`}>
                          {statusLabel(task.status)}
                        </span>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border whitespace-nowrap ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.normal}`}>
                          {statusLabel(task.priority)}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-warm-white/40 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-warm-white/30">
                        {task.stage && (
                          <span>Stage: {statusLabel(task.stage)}</span>
                        )}
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                        {task.assignedToId && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            Assigned
                          </span>
                        )}
                      </div>
                    </div>
                    {task.status === "completed" && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {task.status === "blocked" && (
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "expenses" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-warm-white/50">
                Total: <span className="text-warm-white font-medium">{formatCurrency(totalExpenses)}</span>
              </span>
              <span className="text-warm-white/50">
                Approved: <span className="text-emerald-400 font-medium">{formatCurrency(approvedExpenses)}</span>
              </span>
            </div>
          </div>
          {event.expenses.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
              <p className="text-warm-white/40 text-lg mb-2">No expenses yet</p>
              <p className="text-warm-white/30 text-sm">Expenses will appear here once recorded for this event.</p>
            </Card>
          ) : (
            <Card variant="bordered" padding="none">
              <div className="divide-y divide-border">
                {event.expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between gap-4 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-warm-white text-sm">{expense.description}</h3>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border whitespace-nowrap ${EXPENSE_STATUS_STYLES[expense.status] || EXPENSE_STATUS_STYLES.pending}`}>
                          {statusLabel(expense.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-warm-white/30">
                        <span className="capitalize">{expense.category}</span>
                        {expense.vendor && <span>Vendor: {expense.vendor}</span>}
                        <span>{formatDate(expense.createdAt)}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-warm-white shrink-0">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === "media" && (
        <div>
          {event.eventMedia.length === 0 ? (
            <Card variant="glass" className="p-12 text-center">
              <Image className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
              <p className="text-warm-white/40 text-lg mb-2">No media files yet</p>
              <p className="text-warm-white/30 text-sm">Upload images, videos, and documents for this event.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {event.eventMedia.map((media) => (
                <Card key={media.id} variant="bordered" padding="none" className="overflow-hidden">
                  {media.type === "image" ? (
                    <div className="aspect-square bg-surface-lighter flex items-center justify-center">
                      <Image className="w-8 h-8 text-warm-white/10" />
                    </div>
                  ) : media.type === "video" ? (
                    <div className="aspect-video bg-surface-lighter flex items-center justify-center">
                      <FileText className="w-8 h-8 text-warm-white/10" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-surface-lighter flex items-center justify-center">
                      <FileText className="w-8 h-8 text-warm-white/10" />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="text-sm text-warm-white truncate">{media.title || "Untitled"}</p>
                    <p className="text-xs text-warm-white/30 capitalize">{media.type}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "technical" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {event.equipmentChecklist && (
            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gold" />
                Equipment Checklist
              </h3>
              <div className="space-y-1.5">
                {(() => {
                  try {
                    const items = JSON.parse(event.equipmentChecklist);
                    if (Array.isArray(items)) {
                      return items.map((item: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-warm-white/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-warm-white/20 shrink-0" />
                          {item}
                        </div>
                      ));
                    }
                  } catch {
                    return (
                      <p className="text-sm text-warm-white/60 whitespace-pre-wrap">{event.equipmentChecklist}</p>
                    );
                  }
                  return null;
                })()}
              </div>
            </Card>
          )}

          {event.technicalRider && (
            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                Technical Rider
              </h3>
              <p className="text-sm text-warm-white/60 whitespace-pre-wrap">{event.technicalRider}</p>
            </Card>
          )}

          {event.hospitalityRider && (
            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gold" />
                Hospitality Rider
              </h3>
              <p className="text-sm text-warm-white/60 whitespace-pre-wrap">{event.hospitalityRider}</p>
            </Card>
          )}

          {event.stageLayout && (
            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                Stage Layout
              </h3>
              <p className="text-sm text-warm-white/60 whitespace-pre-wrap">{event.stageLayout}</p>
            </Card>
          )}

          {event.riskAssessment && (
            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-gold" />
                Risk Assessment
              </h3>
              <p className="text-sm text-warm-white/60 whitespace-pre-wrap">{event.riskAssessment}</p>
            </Card>
          )}

          {event.emergencyContacts && (
            <Card variant="bordered" padding="md">
              <h3 className="text-sm font-semibold text-warm-white mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                Emergency Contacts
              </h3>
              <div className="space-y-1.5">
                {(() => {
                  try {
                    const contacts = JSON.parse(event.emergencyContacts);
                    if (Array.isArray(contacts)) {
                      return contacts.map((c: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-warm-white/60">
                          <Phone className="w-3.5 h-3.5 text-warm-white/20 shrink-0" />
                          {c}
                        </div>
                      ));
                    }
                  } catch {
                    return (
                      <p className="text-sm text-warm-white/60 whitespace-pre-wrap">{event.emergencyContacts}</p>
                    );
                  }
                  return null;
                })()}
              </div>
            </Card>
          )}

          {!event.equipmentChecklist && !event.technicalRider && !event.hospitalityRider && !event.stageLayout && !event.riskAssessment && !event.emergencyContacts && (
            <Card variant="glass" className="p-12 text-center lg:col-span-2">
              <Wrench className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
              <p className="text-warm-white/40 text-lg mb-2">No technical details yet</p>
              <p className="text-warm-white/30 text-sm">Technical requirements, riders, and assessments will appear here.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
