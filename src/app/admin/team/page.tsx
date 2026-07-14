"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Filter, ChevronDown, Users, Loader2, AlertCircle,
  Plus, User, Briefcase, DollarSign, Star,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string | null;
  phone: string | null;
  avatarUrl: string | null;
  department: string | null;
  hourlyRate: number | null;
  isFreelancer: boolean;
  isActive: boolean;
  skills: string | null;
  bio: string | null;
  contractType: string | null;
  hireDate: string | null;
  createdAt: string;
}

const roleLabels: Record<string, string> = {
  artist: "Artist",
  sound_engineer: "Sound Engineer",
  photographer: "Photographer",
  videographer: "Videographer",
  event_manager: "Event Manager",
  band_manager: "Band Manager",
  marketing: "Marketing",
  finance: "Finance",
  legal: "Legal",
  hr: "HR",
  admin: "Admin",
};

const contractTypeLabels: Record<string, string> = {
  full_time: "Full-Time",
  part_time: "Part-Time",
  freelance: "Freelance",
  contract: "Contract",
};

const roleBadgeVariant: Record<string, "default" | "gold" | "red" | "outline" | "glass"> = {
  artist: "gold",
  sound_engineer: "default",
  photographer: "default",
  videographer: "default",
  event_manager: "glass",
  band_manager: "glass",
  marketing: "outline",
  finance: "outline",
  legal: "outline",
  hr: "outline",
  admin: "outline",
};

const roleTabs = [
  "All",
  "Artist",
  "Sound Engineer",
  "Photographer",
  "Videographer",
  "Event Manager",
  "Band Manager",
  "Marketing",
  "Finance",
  "Legal",
  "HR",
  "Admin",
];

const roleValueMap: Record<string, string> = {
  Artist: "artist",
  "Sound Engineer": "sound_engineer",
  Photographer: "photographer",
  Videographer: "videographer",
  "Event Manager": "event_manager",
  "Band Manager": "band_manager",
  Marketing: "marketing",
  Finance: "finance",
  Legal: "legal",
  HR: "hr",
  Admin: "admin",
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const avatarColors = [
  "bg-gold/20 text-gold",
  "bg-emerald-400/20 text-emerald-400",
  "bg-purple-400/20 text-purple-400",
  "bg-blue-400/20 text-blue-400",
  "bg-amber-400/20 text-amber-400",
  "bg-pink-400/20 text-pink-400",
  "bg-cyan-400/20 text-cyan-400",
];

export default function AdminTeamPage() {
  const [members, setMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeRole, setActiveRole] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setMembers(data.members || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  const filtered = members.filter((m) => {
    const roleValue = roleValueMap[activeRole];
    const matchesRole = activeRole === "All" || m.role === roleValue;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && m.isActive) ||
      (statusFilter === "Inactive" && !m.isActive) ||
      (statusFilter === "Freelancer" && m.isFreelancer) ||
      (statusFilter === "Full-Time" && m.contractType === "full_time");
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.department?.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q);
    return matchesRole && matchesStatus && matchesSearch;
  });

  const stats = {
    total: members.length,
    active: members.filter((m) => m.isActive).length,
    freelancers: members.filter((m) => m.isFreelancer).length,
    fullTime: members.filter((m) => m.contractType === "full_time").length,
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
            Team Management
          </h1>
          <p className="text-warm-white/40 mt-1">
            Manage your team members & collaborators
          </p>
        </div>
        <Link href="/admin/team/new">
          <Button>
            <Plus className="w-4 h-4" />
            Add Member
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-warm-white">{stats.total}</p>
          <p className="text-xs text-warm-white/40">Total Members</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.active}</p>
          <p className="text-xs text-warm-white/40">Active</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-amber-400">{stats.freelancers}</p>
          <p className="text-xs text-warm-white/40">Freelancers</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.fullTime}</p>
          <p className="text-xs text-warm-white/40">Full-Time</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="text"
            placeholder="Search by name, role, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Freelancer">Freelancers</option>
            <option value="Full-Time">Full-Time</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {roleTabs.map((role) => {
          const isActive = activeRole === role;
          return (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gold text-charcoal"
                  : "bg-surface-light text-warm-white/60 hover:text-warm-white hover:bg-surface-lighter border border-border"
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Users className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No team members found</p>
          <p className="text-warm-white/30 text-sm">
            Add team members to manage your crew and collaborators.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member, i) => {
            const colorClass = avatarColors[i % avatarColors.length];
            const skills = (() => {
              if (!member.skills) return [];
              try {
                return JSON.parse(member.skills) as string[];
              } catch {
                return [];
              }
            })();

            return (
              <Card key={member.id} variant="hover" className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${colorClass}`}
                    >
                      {getInitials(member.name)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-warm-white truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-warm-white/40 capitalize">
                      {roleLabels[member.role] || member.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        member.isActive ? "bg-emerald-400" : "bg-warm-white/20"
                      }`}
                    />
                    <span className="text-xs text-warm-white/40">
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-xs text-warm-white/50">
                    <Briefcase className="w-3 h-3 shrink-0" />
                    <span className="capitalize">
                      {member.department || "—"}
                    </span>
                    {member.contractType && (
                      <Badge variant="outline" size="sm">
                        {contractTypeLabels[member.contractType] || member.contractType}
                      </Badge>
                    )}
                    {member.isFreelancer && (
                      <Badge variant="gold" size="sm">
                        Freelancer
                      </Badge>
                    )}
                  </div>
                  {member.email && (
                    <div className="flex items-center gap-2 text-xs text-warm-white/50">
                      <User className="w-3 h-3 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  {member.hourlyRate !== null && (
                    <div className="flex items-center gap-2 text-xs text-warm-white/50">
                      <DollarSign className="w-3 h-3 shrink-0" />
                      <span>ETB {member.hourlyRate.toLocaleString()}/hr</span>
                    </div>
                  )}
                </div>

                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {skills.length > 4 && (
                      <span className="px-2 py-0.5 rounded-full bg-surface text-warm-white/40 text-[10px]">
                        +{skills.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
