"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Users,
  Handshake,
  Building2,
  FileText,
  Image,
  Shield,
  DollarSign,
  CreditCard,
  Brain,
  BarChart3,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  Send,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect, useCallback } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Operations",
    items: [
      { href: "/admin/events", label: "Events", icon: CalendarDays },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { href: "/admin/team", label: "Team", icon: Users },
    ],
  },
  {
    title: "Business",
    items: [
      { href: "/admin/sponsors", label: "Sponsors", icon: Handshake },
      { href: "/admin/partnerships", label: "Partnerships", icon: Building2 },
      { href: "/admin/proposals", label: "Proposals", icon: FileText },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/admin/media", label: "Media Library", icon: Image },
      { href: "/admin/legal", label: "Legal Center", icon: Shield },
      { href: "/admin/send-license", label: "Send License", icon: Send },
    ],
  },
  {
    title: "Finance",
    items: [
      { href: "/admin/finances", label: "Finances", icon: DollarSign },
      { href: "/admin/payments", label: "Payments", icon: CreditCard },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/admin/ai", label: "AI Assistant", icon: Brain },
      { href: "/admin/reports", label: "Reports", icon: BarChart3 },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/courses", label: "Courses", icon: BookOpen },
      { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function SidebarLogo({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="h-16 flex items-center justify-between px-3 border-b border-border">
      <Link
        href="/admin"
        className={cn(
          "flex items-center gap-2 overflow-hidden",
          collapsed && "justify-center w-full"
        )}
      >
        <img
          src="/LOGO RAY  BAND.jpg"
          alt="Ray Band"
          className="w-7 h-7 rounded-lg object-cover shrink-0"
        />
        {!collapsed && (
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-bold font-[family-name:var(--font-playfair)] text-gold truncate">
              Ray Band
            </span>
            <span className="text-[9px] text-warm-white/30 font-mono bg-surface-light px-1.5 py-0.5 rounded shrink-0">
              ENTERPRISE
            </span>
          </div>
        )}
      </Link>
      <button
        onClick={onToggle}
        className={cn(
          "text-warm-white/40 hover:text-warm-white transition-colors shrink-0",
          collapsed && "absolute -right-3 top-4 bg-surface border border-border rounded-full p-0.5"
        )}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

function NavGroup({
  section,
  collapsed,
  pathname,
  isOpen,
  onToggle,
}: {
  section: NavSection;
  collapsed: boolean;
  pathname: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const isAnyActive = section.items.some(
    (item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
  );

  if (collapsed) {
    // When collapsed, only show the section title as a group indicator
    return (
      <div className="space-y-1 mb-4">
        {section.items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center w-9 h-9 mx-auto rounded-lg transition-all",
                isActive
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-warm-white/40 hover:text-warm-white hover:bg-surface-light"
              )}
              title={item.label}
            >
              <item.icon className="w-4.5 h-4.5" />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-warm-white/30 hover:text-warm-white/60 transition-colors"
      >
        <span>{section.title}</span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="mt-1 space-y-0.5">
          {section.items.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                  isActive
                    ? "bg-gold/10 text-gold border border-gold/20"
                    : "text-warm-white/60 hover:text-warm-white hover:bg-surface-light"
                )}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface AdminSidebarProps {
  isOverlay?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOverlay = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(
    navSections.map((s) => s.title)
  );

  // Auto-open section containing active page
  useEffect(() => {
    const activeSection = navSections.find((section) =>
      section.items.some(
        (item) => pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
      )
    );
    if (activeSection && !openSections.includes(activeSection.title)) {
      setOpenSections((prev) => [...prev, activeSection.title]);
    }
  }, [pathname]);

  const toggleSection = useCallback(
    (title: string) => {
      setOpenSections((prev) =>
        prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
      );
    },
    []
  );

  const sidebarContent = (
    <>
      <SidebarLogo
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin">
        {navSections.map((section) => (
          <NavGroup
            key={section.title}
            section={section}
            collapsed={collapsed}
            pathname={pathname}
            isOpen={openSections.includes(section.title)}
            onToggle={() => toggleSection(section.title)}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div
          className={cn(
            "flex items-center",
            collapsed ? "justify-center" : "gap-3"
          )}
        >
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs text-warm-white/40 truncate">Admin Panel</p>
              <p className="text-[10px] text-warm-white/20 truncate">Ray Entertainment</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isOverlay) {
    return (
      <aside
        className="fixed inset-0 z-50 flex lg:hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Sidebar panel */}
        <div className="relative w-72 h-full bg-surface border-r border-border shadow-2xl animate-in slide-in-from-left duration-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-warm-white/40 hover:text-warm-white transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
          {sidebarContent}
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-surface border-r border-border z-40",
        "flex-col transition-all duration-300",
        "hidden lg:flex",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {sidebarContent}
    </aside>
  );
}

export function AdminSidebarToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-surface border border-border text-warm-white/60 hover:text-warm-white transition-colors"
      aria-label="Open sidebar"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
