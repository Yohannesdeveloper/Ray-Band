import {
  Bell, Check, CheckCheck, Trash2, CalendarClock, Info,
  AlertTriangle, AlertCircle, Mail, Settings, Clock,
  Handshake, FileText, CreditCard, Users, Megaphone,
  Inbox,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function getNotificationIcon(type: string, category: string) {
  if (type === "reminder") return CalendarClock;
  if (type === "error") return AlertCircle;
  if (type === "warning") return AlertTriangle;
  if (type === "success") return CheckCheck;

  switch (category) {
    case "event": return CalendarClock;
    case "sponsor": return Handshake;
    case "legal": return FileText;
    case "task": return Check;
    case "payment": return CreditCard;
    default: return Info;
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case "reminder": return "text-amber-400 bg-amber-400/10";
    case "error": return "text-red-400 bg-red-400/10";
    case "warning": return "text-orange-400 bg-orange-400/10";
    case "success": return "text-emerald-400 bg-emerald-400/10";
    default: return "text-blue-400 bg-blue-400/10";
  }
}

interface NotificationPageProps {
  searchParams: Promise<{ tab?: string }>;
}

export default async function NotificationsPage({ searchParams }: NotificationPageProps) {
  const params = await searchParams;
  const activeTab = params.tab || "all";

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where:
        activeTab === "unread"
          ? { read: false }
          : activeTab === "reminders"
          ? { type: "reminder" }
          : activeTab === "system"
          ? { category: "system" }
          : {},
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    db.notification.count({ where: { read: false } }),
  ]);

  const tabs = [
    { id: "all", label: "All", count: null },
    { id: "unread", label: "Unread", count: unreadCount },
    { id: "reminders", label: "Reminders", count: null },
    { id: "system", label: "System", count: null },
  ];

  const grouped = notifications.reduce<Record<string, typeof notifications>>((acc, n) => {
    const d = new Date(n.createdAt);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    const label = isToday ? "Today" : isYesterday ? "Yesterday" : "Older";
    if (!acc[label]) acc[label] = [];
    acc[label].push(n);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Notifications
          </h1>
          <p className="text-warm-white/40 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <form action="/api/notifications" method="PUT">
              <Button variant="outline" size="sm">
                <CheckCheck className="w-4 h-4" /> Mark All Read
              </Button>
            </form>
          )}
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-surface-light rounded-xl w-fit">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            href={`/admin/notifications?tab=${tab.id}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gold/10 text-gold border border-gold/20"
                : "text-warm-white/50 hover:text-warm-white hover:bg-surface-lighter"
            }`}
          >
            {tab.label}
            {tab.count !== null && tab.count > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gold/20 text-gold">
                {tab.count}
              </span>
            )}
          </a>
        ))}
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <div className="flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-surface-light mb-4">
              <Inbox className="w-12 h-12 text-warm-white/20" />
            </div>
            <h3 className="text-lg font-bold text-warm-white mb-1">
              No notifications
            </h3>
            <p className="text-sm text-warm-white/40 max-w-sm">
              {activeTab === "unread"
                ? "You have no unread notifications. Great job staying on top of things!"
                : activeTab === "reminders"
                ? "No reminders at the moment. All caught up!"
                : activeTab === "system"
                ? "No system notifications to display."
                : "No notifications yet. They will appear here as events and activities occur."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([label, items]) => (
            <div key={label}>
              <h3 className="text-xs font-medium text-warm-white/40 uppercase tracking-wider mb-3 px-1">
                {label}
              </h3>
              <Card variant="glass" className="p-0 divide-y divide-border/50">
                {items.map((notification) => {
                  const IconComponent = getNotificationIcon(
                    notification.type,
                    notification.category
                  );
                  const colorClass = getNotificationColor(notification.type);

                  return (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 transition-colors ${
                        !notification.read
                          ? "bg-gold/[0.03] border-l-2 border-l-gold"
                          : "border-l-2 border-l-transparent"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`p-2 rounded-xl flex-shrink-0 ${colorClass}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4
                            className={`text-sm ${
                              !notification.read
                                ? "font-bold text-warm-white"
                                : "font-medium text-warm-white/80"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-warm-white/50 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-xs text-warm-white/30">
                            <Clock className="w-3 h-3" />
                            {timeAgo(notification.createdAt)}
                          </span>
                          <Badge variant="outline" size="sm">
                            {notification.category}
                          </Badge>
                          {notification.type !== "info" && (
                            <Badge
                              variant={
                                notification.type === "error"
                                  ? "red"
                                  : notification.type === "warning"
                                  ? "gold"
                                  : "default"
                              }
                              size="sm"
                            >
                              {notification.type}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && (
                          <form
                            action={`/api/notifications`}
                            method="PUT"
                            className="inline"
                          >
                            <input type="hidden" name="id" value={notification.id} />
                            <input type="hidden" name="read" value="true" />
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg hover:bg-surface-lighter transition-colors text-warm-white/30 hover:text-emerald-400"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          </form>
                        )}
                        {notification.read && (
                          <form
                            action={`/api/notifications`}
                            method="PUT"
                            className="inline"
                          >
                            <input type="hidden" name="id" value={notification.id} />
                            <input type="hidden" name="read" value="false" />
                            <button
                              type="submit"
                              className="p-1.5 rounded-lg hover:bg-surface-lighter transition-colors text-warm-white/30 hover:text-gold"
                              title="Mark as unread"
                            >
                              <Bell className="w-4 h-4" />
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
