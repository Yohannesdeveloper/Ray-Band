"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, X, ArrowRight, Music, BookOpen, Calendar,
  ShoppingBag, FileText, HelpCircle, Guitar, Mic,
  Piano, Drum,
} from "lucide-react";

const searchData = [
  { type: "page", title: "Wedding Entertainment", href: "/services#wedding", icon: Music },
  { type: "page", title: "Corporate Events", href: "/services#corporate", icon: Calendar },
  { type: "page", title: "Book The Band", href: "/book", icon: Calendar },
  { type: "course", title: "Guitar Mastery: Complete Course", href: "/courses/guitar-mastery-complete-course", icon: Guitar },
  { type: "course", title: "Piano Foundations", href: "/courses/piano-foundations", icon: Piano },
  { type: "course", title: "Vocal Performance Mastery", href: "/courses/vocal-performance-mastery", icon: Mic },
  { type: "course", title: "Drumming Essentials", href: "/courses/drumming-essentials", icon: Drum },
  { type: "course", title: "Music Theory Deep Dive", href: "/courses/music-theory-deep-dive", icon: BookOpen },
  { type: "course", title: "Music Production with Logic Pro", href: "/courses/music-production-with-logic-pro", icon: Music },
  { type: "page", title: "Meet the Band", href: "/band", icon: Music },
  { type: "page", title: "Gallery", href: "/gallery", icon: Music },
  { type: "page", title: "Music Library", href: "/music", icon: Music },
  { type: "page", title: "Merchandise Shop", href: "/shop", icon: ShoppingBag },
  { type: "page", title: "Blog", href: "/blog", icon: FileText },
  { type: "page", title: "Testimonials", href: "/testimonials", icon: FileText },
  { type: "page", title: "Contact Us", href: "/contact", icon: FileText },
  { type: "page", title: "FAQ", href: "/faq", icon: HelpCircle },
  { type: "page", title: "About Ray Entertainment and Promotion", href: "/about", icon: Music },
];

const typeLabels: Record<string, string> = {
  page: "Pages",
  course: "Courses",
};

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filtered = query.trim()
    ? searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase())
      )
    : searchData.slice(0, 8);

  const grouped = filtered.reduce(
    (acc, item) => {
      const key = item.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {} as Record<string, typeof searchData>
  );

  const handleSelect = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Trigger Button (used in Navbar) */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2.5 rounded-xl text-warm-white/60 hover:text-warm-white hover:bg-white/5 transition-colors"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Box */}
          <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="w-5 h-5 text-warm-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search courses, pages, events..."
                className="flex-1 bg-transparent text-warm-white placeholder:text-warm-white/30 outline-none text-base"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-light border border-border text-xs text-warm-white/30">
                ESC
              </kbd>
              <button
                onClick={() => setIsOpen(false)}
                className="sm:hidden text-warm-white/40 hover:text-warm-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-warm-white/30 text-sm">
                    No results for &ldquo;{query}&rdquo;
                  </p>
                </div>
              ) : (
                Object.entries(grouped).map(([type, items]) => (
                  <div key={type} className="mb-2">
                    <p className="px-3 py-2 text-xs font-medium text-warm-white/30 uppercase tracking-wider">
                      {typeLabels[type] || type}
                    </p>
                    {items.map((item) => (
                      <button
                        key={item.title}
                        onClick={() => handleSelect(item.href)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/5 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-gold" />
                        </div>
                        <span className="flex-1 text-sm text-warm-white/80 group-hover:text-warm-white">
                          {item.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-warm-white/20 group-hover:text-gold transition-colors" />
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-surface-light/50">
              <div className="flex items-center gap-4 text-xs text-warm-white/20">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">↑↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[10px]">↵</kbd>
                  Select
                </span>
              </div>
              <span className="text-xs text-warm-white/20">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
