"use client";

import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeUp, FadeIn } from "@/components/ui/animations";

const testimonials = [
  {
    name: "Abeba & Daniel",
    event: "Wedding",
    rating: 5,
    text: "Ray Band made our wedding absolutely magical. Every song was perfectly chosen, and the energy they brought had all our guests on the dance floor. Truly unforgettable!",
    image: null,
  },
  {
    name: "Ethiopian Airlines",
    event: "Corporate",
    rating: 5,
    text: "Professional, punctual, and absolutely phenomenal. Ray Band delivered an outstanding performance at our annual gala. Our international guests were thoroughly impressed.",
    image: null,
  },
  {
    name: "The Sheraton Addis",
    event: "Hotel",
    rating: 5,
    text: "We regularly feature Ray Band at our hotel events. Their versatility and professionalism are unmatched. They elevate every occasion they perform at.",
    image: null,
  },
  {
    name: "Maria & Yohannes",
    event: "Wedding",
    rating: 5,
    text: "From the consultation to the last dance, everything was perfect. The band learned our special song and performed it live. We were in tears!",
    image: null,
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-surface">
      <Container>
        <FadeUp>
          <SectionHeading
            badge="Testimonials"
            title="What Our Clients"
            highlighted="Say"
            description="Real stories from real clients who experienced the magic of Ray Band."
          />
        </FadeUp>

        {/* Featured Testimonial */}
        <div className="mt-16 max-w-4xl mx-auto">
          <FadeIn>
            <Card variant="glass" padding="lg" className="text-center relative">
              <Quote className="w-12 h-12 text-gold/20 mx-auto mb-6" />
              <p className="text-lg md:text-xl text-warm-white/80 leading-relaxed italic">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>
              <div className="mt-6 flex items-center justify-center gap-1">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                ))}
              </div>
              <div className="mt-4">
                <p className="font-semibold text-warm-white">
                  {testimonials[current].name}
                </p>
                <Badge variant="gold" size="sm" className="mt-2">
                  {testimonials[current].event}
                </Badge>
              </div>
            </Card>
          </FadeIn>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="ghost" size="sm" onClick={prev}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? "bg-gold w-6" : "bg-warm-white/20"
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={next}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
