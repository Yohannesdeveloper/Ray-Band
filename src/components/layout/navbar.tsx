"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SearchModal } from "@/components/search/search-modal";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/band", label: "Band" },
  { href: "/gallery", label: "Gallery" },
  { href: "/music", label: "Music" },
  { href: "/services", label: "Studio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "glass shadow-xl shadow-black/10 py-3"
            : "bg-transparent py-5"
        )}
      >
        <Container>
          <nav className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/LOGO RAY  BAND.jpg" alt="Ray Band" className="w-14 h-14 rounded-xl object-cover border-2 border-gold/30 group-hover:border-gold/60 transition-all duration-300 group-hover:scale-105 shadow-lg shadow-gold/10" />
              <span className="text-2xl font-bold font-[family-name:var(--font-playfair)]">
                Ray Band
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "text-gold bg-gold/10"
                      : "text-warm-white/70 hover:text-warm-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <SearchModal />
              <Button variant="primary" size="sm" asChild>
                <Link href="/book">Book The Band</Link>
              </Button>
            </div>

            <div className="flex lg:hidden items-center gap-2">
              <button
                className="p-2 rounded-lg text-warm-white/60 hover:text-warm-white"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </nav>
        </Container>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        <div
          className={cn(
            "absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-surface border-l border-border p-6 pt-24 transition-transform duration-300",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-xl text-base font-medium transition-colors",
                  pathname === link.href
                    ? "text-gold bg-gold/10"
                    : "text-warm-white/70 hover:text-warm-white hover:bg-white/5"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button variant="primary" className="w-full" asChild>
              <Link href="/book">Book The Band</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/shop">Shop</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
