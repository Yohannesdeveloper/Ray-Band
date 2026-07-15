"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Music,
  Send,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = {
  entertainment: [
    { label: "Vocal Recording", href: "/services" },
    { label: "Instrument Recording", href: "/services" },
    { label: "Mixing & Mastering", href: "/services" },
    { label: "Music Production", href: "/services" },
    { label: "Podcast Recording", href: "/services" },
    { label: "Book a Session", href: "/book" },
  ],
  academy: [
    { label: "Guitar Courses", href: "/courses?category=guitar" },
    { label: "Piano Courses", href: "/courses?category=piano" },
    { label: "Vocal Training", href: "/courses?category=vocals" },
    { label: "Music Theory", href: "/courses?category=theory" },
    { label: "Drums", href: "/courses?category=drums" },
    { label: "View All Courses", href: "/courses" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Meet the Band", href: "/band" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  support: [
    { label: "FAQ", href: "/faq" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refunds" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="3" />
      <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M16 8h-2a3 3 0 0 0-3 3v1h-2v3h2v5h3v-5h2l.5-3H14v-1a1 1 0 0 1 1-1h1z" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16H20L8.267 4H4z" />
      <path d="M4 20l6.768-6.768M20 4l-6.768 6.768" />
    </svg>
  );
}

const socialLinks = [
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: YoutubeIcon, href: "#", label: "YouTube" },
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: XIcon, href: "#", label: "X (Twitter)" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-surface border-t border-border">
      <Container>
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
                Stay in the <span className="gradient-text">rhythm</span>
              </h3>
              <p className="text-warm-white/50 text-sm mt-1">
                Get exclusive updates on performances, new courses, and special offers.
              </p>
            </div>
            <form
              onSubmit={handleSubscribe}
              className="flex w-full lg:w-auto gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full lg:w-72"
                required
              />
              <Button type="submit" variant="primary" size="md">
                {subscribed ? (
                  "Subscribed!"
                ) : (
                  <>
                    Subscribe <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 mb-4"
            >
              <img src="/LOGO RAY  BAND.jpg" alt="Ray Band" className="w-10 h-10 rounded-xl object-cover border border-gold/20" />
              <span className="text-xl font-bold font-[family-name:var(--font-playfair)]">
                Ray Band
              </span>
            </Link>
            <p className="text-sm text-warm-white/40 leading-relaxed mb-6">
              World-class live band entertainment and music education.
              Creating unforgettable experiences since 2014.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-border flex items-center justify-center text-warm-white/50 hover:text-gold hover:border-gold/30 hover:bg-gold/10 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-warm-white uppercase tracking-wider mb-4">
                {category === "entertainment"
                  ? "Studio"
                  : category === "academy"
                  ? "Academy"
                  : category === "company"
                  ? "Company"
                  : "Support"}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-warm-white/40 hover:text-gold transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-warm-white/30">
            &copy; {new Date().getFullYear()} Ray Band Entertainment. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-warm-white/30">
              Addis Ababa, Ethiopia
            </span>
            <span className="w-1 h-1 rounded-full bg-warm-white/20" />
            <span className="text-xs text-warm-white/30">
              Available Worldwide
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
