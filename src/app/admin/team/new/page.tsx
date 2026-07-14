"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, Users, Save, UserPlus,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const roleOptions = [
  { value: "artist", label: "Artist" },
  { value: "sound_engineer", label: "Sound Engineer" },
  { value: "photographer", label: "Photographer" },
  { value: "videographer", label: "Videographer" },
  { value: "event_manager", label: "Event Manager" },
  { value: "band_manager", label: "Band Manager" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance" },
  { value: "legal", label: "Legal" },
  { value: "hr", label: "HR" },
  { value: "admin", label: "Admin" },
];

const contractTypeOptions = [
  { value: "full_time", label: "Full-Time" },
  { value: "part_time", label: "Part-Time" },
  { value: "freelance", label: "Freelance" },
  { value: "contract", label: "Contract" },
];

export default function NewTeamMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [role, setRole] = useState("artist");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [isFreelancer, setIsFreelancer] = useState(false);
  const [contractType, setContractType] = useState("full_time");
  const [hireDate, setHireDate] = useState("");
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          role,
          email: email || null,
          phone: phone || null,
          department: department || null,
          hourlyRate: hourlyRate ? Number(hourlyRate) : null,
          isFreelancer,
          contractType: contractType || null,
          hireDate: hireDate || null,
          skills: skills
            ? skills
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : null,
          bio: bio || null,
          notes: notes || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create member");
      }

      router.push("/admin/team");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/team"
          className="p-2 rounded-lg hover:bg-surface-light transition-colors text-warm-white/60 hover:text-warm-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Add Team Member
          </h1>
          <p className="text-warm-white/40 mt-1">
            Add a new member to your team
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-gold" />
            Personal Information
          </h2>
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Abraham Mulugeta"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Phone"
                placeholder="+251 9XX XXX XXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-warm-white/80 mb-2">
                Bio
              </label>
              <textarea
                placeholder="Brief bio or description..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
              />
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-gold" />
            Role & Employment
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    {roleOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Contract Type
                </label>
                <div className="relative">
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    {contractTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Department"
                placeholder="e.g. Production"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
              <Input
                label="Hourly Rate (ETB)"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>

            <Input
              label="Hire Date"
              type="date"
              value={hireDate}
              onChange={(e) => setHireDate(e.target.value)}
            />

            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light border border-border">
              <div>
                <p className="text-sm font-medium text-warm-white">Freelancer</p>
                <p className="text-xs text-warm-white/40 mt-0.5">
                  Mark this member as a freelancer
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFreelancer(!isFreelancer)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                  isFreelancer ? "bg-gold" : "bg-surface"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-warm-white shadow transition-transform duration-200 ${
                    isFreelancer ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4">
            Skills & Notes
          </h2>
          <div className="space-y-4">
            <Input
              label="Skills (comma separated)"
              placeholder="e.g. vocal, guitar, stage performance"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-warm-white/80 mb-2">
                Notes
              </label>
              <textarea
                placeholder="Internal notes about this team member..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
              />
            </div>
          </div>
        </Card>

        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin/team">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Add Member
          </Button>
        </div>
      </form>
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
