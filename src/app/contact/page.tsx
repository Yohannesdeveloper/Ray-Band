"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail, Phone, MessageCircle, MapPin, Clock, Send, CheckCircle, Loader2,
} from "lucide-react";

const contactMethods = [
  { icon: Phone, label: "Phone", value: "+251 91 234 5678", action: "tel:+251912345678" },
  { icon: Mail, label: "Email", value: "hello@rayband.com", action: "mailto:hello@rayband.com" },
  { icon: MessageCircle, label: "WhatsApp", value: "Chat with us", action: "#" },
  { icon: MapPin, label: "Location", value: "Addis Ababa, Ethiopia", action: "#" },
  { icon: Clock, label: "Office Hours", value: "Mon-Sat: 9AM - 6PM", action: null },
];

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
        setForm({ firstName: "", lastName: "", email: "", phone: "", eventType: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Contact Us</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Let&apos;s <span className="gradient-text">Connect</span>
              </h1>
              <p className="text-lg text-warm-white/60">
                Ready to create something extraordinary? Get in touch and
                let&apos;s make your event unforgettable.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-24 bg-surface">
          <Container>
            <div className="grid lg:grid-cols-5 gap-12">
              <div className="lg:col-span-3">
                <Card variant="bordered" padding="lg">
                  {sent ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                      <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">Message Sent!</h2>
                      <p className="text-warm-white/50 mb-6">Thank you for reaching out. We&apos;ll get back to you soon.</p>
                      <Button variant="outline" onClick={() => setSent(false)}>Send Another Message</Button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-6">
                        Send Us a Message
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                          <Input
                            label="First Name"
                            placeholder="Your first name"
                            required
                            value={form.firstName}
                            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          />
                          <Input
                            label="Last Name"
                            placeholder="Your last name"
                            required
                            value={form.lastName}
                            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          />
                        </div>
                        <Input
                          label="Email"
                          type="email"
                          placeholder="your@email.com"
                          icon={<Mail className="w-4 h-4" />}
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <Input
                          label="Phone"
                          type="tel"
                          placeholder="+251..."
                          icon={<Phone className="w-4 h-4" />}
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                        <div>
                          <label className="block text-sm font-medium text-warm-white/80 mb-2">Event Type</label>
                          <select
                            value={form.eventType}
                            onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                            className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white transition-all focus:outline-none focus:ring-2 focus:ring-gold/50"
                          >
                            <option value="">Select event type</option>
                            <option>Wedding</option>
                            <option>Corporate Event</option>
                            <option>Private Party</option>
                            <option>Birthday</option>
                            <option>Hotel/Restaurant</option>
                            <option>Concert/Festival</option>
                            <option>Church</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-warm-white/80 mb-2">Message</label>
                          <textarea
                            rows={5}
                            placeholder="Tell us about your event..."
                            required
                            value={form.message}
                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                            className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white placeholder:text-warm-white/30 transition-all focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                          />
                        </div>
                        {error && (
                          <div className="rounded-xl bg-deep-red/10 border border-deep-red/20 px-4 py-3 text-sm text-deep-red-light">
                            {error}
                          </div>
                        )}
                        <Button variant="primary" size="lg" className="w-full" type="submit" disabled={sending}>
                          {sending ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                          ) : (
                            <>Send Message <Send className="w-4 h-4" /></>
                          )}
                        </Button>
                      </form>
                    </>
                  )}
                </Card>
              </div>

              <div className="lg:col-span-2 space-y-4">
                {contactMethods.map((method) => (
                  <Card key={method.label} variant="bordered" padding="md" className="hover:border-gold/30 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                        <method.icon className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-xs text-warm-white/40 uppercase tracking-wider">{method.label}</p>
                        <p className="font-medium text-sm mt-0.5">{method.value}</p>
                      </div>
                    </div>
                  </Card>
                ))}

                <Card variant="bordered" padding="none" className="overflow-hidden">
                  <div className="aspect-video bg-charcoal relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-surface-lighter" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-gold/30 mx-auto mb-2" />
                        <p className="text-xs text-warm-white/30">Google Maps</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
