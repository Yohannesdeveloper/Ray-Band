"use client";

import { useState, useEffect } from "react";
import {
  BookOpen, Plus, Search, Edit, Trash2, Eye, X,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: string;
  title: string;
  slug: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  enrollmentCount: number;
  lessonCount: number | null;
  rating: number;
  published: boolean;
  featured: boolean;
  trailerUrl: string | null;
}

const categoryColors: Record<string, string> = {
  piano: "bg-blue-500/10 text-blue-400",
  guitar: "bg-amber-500/10 text-amber-400",
  vocals: "bg-pink-500/10 text-pink-400",
  drums: "bg-red-500/10 text-red-400",
  production: "bg-violet-500/10 text-violet-400",
  theory: "bg-emerald-500/10 text-emerald-400",
};

const levelColors: Record<string, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400",
  intermediate: "bg-amber-500/10 text-amber-400",
  advanced: "bg-red-500/10 text-red-400",
};

function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  }
  return null;
}

const emptyForm = {
  title: "",
  instructor: "",
  category: "guitar",
  level: "beginner",
  price: "",
  description: "",
  shortDescription: "",
  trailerUrl: "",
  durationHours: "",
  lessonCount: "",
  featured: false,
  published: true,
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data);
    } catch {
      console.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowForm(false);
        setForm(emptyForm);
        fetchCourses();
      }
    } catch {
      console.error("Failed to create course");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      await fetch(`/api/courses/${id}`, { method: "DELETE" });
      fetchCourses();
    } catch {
      console.error("Failed to delete course");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Courses
          </h1>
          <p className="text-warm-white/40 mt-1">
            Manage courses, lessons, and curricula
          </p>
        </div>
        <Button variant="primary" className="gap-2" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4" /> New Course
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-warm-white">{courses.length}</p>
          <p className="text-xs text-warm-white/40">Total Courses</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-warm-white">
            {courses.reduce((sum, c) => sum + c.enrollmentCount, 0)}
          </p>
          <p className="text-xs text-warm-white/40">Total Enrolled</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-warm-white">
            {courses.reduce((sum, c) => sum + (c.lessonCount || 0), 0)}
          </p>
          <p className="text-xs text-warm-white/40">Total Lessons</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-gold">
            {courses.length > 0
              ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
              : "0.0"}
          </p>
          <p className="text-xs text-warm-white/40">Avg Rating</p>
        </Card>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-gold animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-16 h-16 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No courses yet</p>
          <p className="text-warm-white/30 text-sm">Click &quot;New Course&quot; to create your first course.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <Card key={course.id} variant="glass" className="overflow-hidden hover:border-gold/20 transition-all">
              <div className="h-32 bg-gradient-to-br from-gold/10 to-gold/5 relative overflow-hidden">
                {(() => {
                  const thumbnail = getYouTubeThumbnail(course.trailerUrl || "");
                  return thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={course.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-gold/30" />
                    </div>
                  );
                })()}
                {course.featured && (
                  <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full bg-gold text-black font-medium">
                    Featured
                  </span>
                )}
                {course.trailerUrl && (
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-black/60 text-white">
                    Has Video
                  </span>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-gold/30" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-warm-white text-sm">{course.title}</h3>
                </div>
                <p className="text-xs text-warm-white/40 mb-3">by {course.instructor}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColors[course.category] || "bg-gray-500/10 text-gray-400"}`}>
                    {course.category}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${levelColors[course.level] || ""}`}>
                    {course.level}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-warm-white/50">
                  <span>{course.enrollmentCount} enrolled</span>
                  <span>{course.lessonCount || 0} lessons</span>
                  <span className="text-gold">★ {course.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <span className="text-sm font-bold text-gold">
                    {course.price > 0 ? `ETB ${course.price.toLocaleString()}` : "Free"}
                  </span>
                  <div className="flex gap-1">
                    <a
                      href={`/courses/${course.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded hover:bg-surface-light text-warm-white/40 hover:text-warm-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-1.5 rounded hover:bg-red-500/10 text-warm-white/40 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <Card variant="glass" className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
                New Course
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded hover:bg-surface-light text-warm-white/40 hover:text-warm-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="e.g. Guitar Mastery: Complete Course"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Instructor *</label>
                <input
                  type="text"
                  required
                  value={form.instructor}
                  onChange={(e) => setForm({ ...form, instructor: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="e.g. David Mehari"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="guitar">Guitar</option>
                    <option value="piano">Piano</option>
                    <option value="vocals">Vocals</option>
                    <option value="drums">Drums</option>
                    <option value="theory">Music Theory</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Level</label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Video Link (YouTube URL)</label>
                <input
                  type="url"
                  value={form.trailerUrl}
                  onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-[11px] text-warm-white/30 mt-1">
                  Paste a YouTube link — it will be embedded on the course page.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                  placeholder="Full course description..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Price (ETB)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Duration (hrs)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={form.durationHours}
                    onChange={(e) => setForm({ ...form, durationHours: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-warm-white/50 mb-1.5">Lessons</label>
                  <input
                    type="number"
                    min="0"
                    value={form.lessonCount}
                    onChange={(e) => setForm({ ...form, lessonCount: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-surface-light text-gold focus:ring-gold/50"
                  />
                  <span className="text-sm text-warm-white/60">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.published}
                    onChange={(e) => setForm({ ...form, published: e.target.checked })}
                    className="w-4 h-4 rounded border-border bg-surface-light text-gold focus:ring-gold/50"
                  />
                  <span className="text-sm text-warm-white/60">Published</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                  ) : (
                    "Create Course"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
