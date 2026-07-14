import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export const metadata: Metadata = {
  title: "Testimonials",
  description:
    "Read what our clients say about Ray Band. Real reviews from weddings, corporate events, and private parties.",
};

const testimonials = [
  { name: "Abeba & Daniel", event: "Wedding", rating: 5, text: "Ray Band made our wedding absolutely magical. Every song was perfectly chosen, and the energy they brought had all our guests on the dance floor. Truly unforgettable!" },
  { name: "Ethiopian Airlines", event: "Corporate", rating: 5, text: "Professional, punctual, and absolutely phenomenal. Ray Band delivered an outstanding performance at our annual gala. Our international guests were thoroughly impressed." },
  { name: "The Sheraton Addis", event: "Hotel", rating: 5, text: "We regularly feature Ray Band at our hotel events. Their versatility and professionalism are unmatched. They elevate every occasion they perform at." },
  { name: "Maria & Yohannes", event: "Wedding", rating: 5, text: "From the consultation to the last dance, everything was perfect. The band learned our special song and performed it live. We were in tears!" },
  { name: "Hilton Addis Ababa", event: "Hotel", rating: 5, text: "Ray Band has been our go-to band for premium events. Their ability to read the audience and adapt is remarkable." },
  { name: "Ato Tadesse Family", event: "Birthday", rating: 5, text: "My father's 70th birthday was absolutely spectacular thanks to Ray Band. They played all his favorites and had everyone dancing." },
  { name: "UNDP Ethiopia", event: "Corporate", rating: 5, text: "Exceptional performance at our conference dinner. The band's professionalism and talent left a lasting impression on all delegates." },
  { name: "Sara & Micah", event: "Wedding", rating: 5, text: "We flew Ray Band in for our destination wedding and it was the best decision we made. They made our celebration truly world-class." },
];

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Testimonials</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                What Clients <span className="gradient-text">Say</span>
              </h1>
              <p className="text-lg text-warm-white/60">
                Real stories from real clients who experienced the magic of Ray Band.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-24 bg-surface">
          <Container>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t) => (
                <Card key={t.name} variant="bordered" padding="lg" className="hover:border-gold/30 transition-colors">
                  <Quote className="w-8 h-8 text-gold/20 mb-4" />
                  <p className="text-warm-white/70 leading-relaxed italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-4 flex items-center gap-1">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-gold fill-gold" />
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <Badge variant="gold" size="sm">{t.event}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
