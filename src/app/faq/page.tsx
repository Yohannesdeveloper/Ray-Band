"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqCategories = [
  {
    category: "Booking",
    questions: [
      { q: "How do I book the band?", a: "Simply click the 'Book The Band' button, fill out our booking wizard with your event details, and we'll get back to you within 24 hours with a customized proposal." },
      { q: "How far in advance should I book?", a: "We recommend booking at least 3-6 months in advance for weddings and large events. However, we do our best to accommodate last-minute requests when availability allows." },
      { q: "Can I request specific songs?", a: "Absolutely! We love learning new songs for our clients. Let us know your preferences during the booking process, and we'll tailor the setlist to your event." },
      { q: "Do you travel for events?", a: "Yes! We perform at events across Ethiopia and internationally. Travel and accommodation costs are included in our out-of-town event packages." },
    ],
  },
  {
    category: "Pricing",
    questions: [
      { q: "How much does it cost to book Ray Band?", a: "Pricing varies based on event type, duration, band size, and location. Contact us for a free quote tailored to your specific needs." },
      { q: "Do you offer payment plans?", a: "Yes, we offer flexible payment plans. Typically, a 50% deposit secures your date, with the balance due before the event." },
      { q: "Are there any hidden fees?", a: "No hidden fees. Our quotes include all costs. Any additional services like lighting or sound equipment will be clearly itemized." },
    ],
  },
  {
    category: "Music Courses",
    questions: [
      { q: "Are the courses suitable for beginners?", a: "Yes! Our courses range from beginner to advanced. Each course clearly indicates the difficulty level so you can find the right fit." },
      { q: "Do I get a certificate?", a: "Yes, upon successful completion of a course, you'll receive a digital certificate of completion from Ray Band Music Academy." },
      { q: "Can I preview a course before buying?", a: "Absolutely! Each course has free preview lessons you can watch before committing to the full course." },
      { q: "Are there live sessions with instructors?", a: "Our premium courses include monthly live Q&A sessions with instructors. Check each course for specific details." },
    ],
  },
  {
    category: "General",
    questions: [
      { q: "What areas do you serve?", a: "We are based in Addis Ababa, Ethiopia, and perform at events nationwide and internationally across Africa and beyond." },
      { q: "Do you provide equipment?", a: "Yes, we bring our own professional-grade sound equipment. Additional lighting and production can be arranged." },
      { q: "What's your cancellation policy?", a: "Full refund if cancelled 30+ days before the event. 50% refund for 15-29 days. No refund within 14 days, but we offer rescheduling options." },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-light transition-colors"
      >
        <span className="font-medium text-sm pr-4">{q}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-warm-white/40 shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-warm-white/50 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">FAQ</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Frequently Asked <span className="gradient-text">Questions</span>
              </h1>
              <p className="text-lg text-warm-white/60">
                Find answers to common questions about our services, courses, and more.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-24 bg-surface">
          <Container>
            <div className="max-w-3xl mx-auto space-y-12">
              {faqCategories.map((cat) => (
                <div key={cat.category}>
                  <h2 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-4">
                    {cat.category}
                  </h2>
                  <div className="space-y-3">
                    {cat.questions.map((faq) => (
                      <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
