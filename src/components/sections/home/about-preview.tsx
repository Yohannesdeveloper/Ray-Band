"use client";

import Link from "next/link";
import { ArrowRight, Award, Heart, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlideFromLeft, SlideFromRight } from "@/components/ui/animations";

export function AboutPreview() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <SlideFromLeft>
            {/* Image / Visual */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-surface border border-border">
                <img
                  src="/Bands/Nati about us.jpg"
                  alt="About Us"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-5">
                <div className="text-3xl font-bold gradient-text">10+</div>
                <div className="text-xs text-warm-white/50">Years of Excellence</div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -left-4 glass rounded-2xl p-4">
                <Award className="w-8 h-8 text-gold" />
              </div>
            </div>
          </SlideFromLeft>

          <SlideFromRight>
            {/* Content */}
            <div>
              <Badge variant="gold" className="mb-6">Our Story</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Crafting Musical{" "}
                <span className="gradient-text">Excellence</span> Since 2014
              </h2>
              <div className="space-y-4 text-warm-white/60 leading-relaxed">
                <p>
                  What started as a passionate group of musicians has grown into
                  one of the country&apos;s most sought-after entertainment
                  brands. We believe every note tells a story, and every
                  performance creates an unforgettable memory.
                </p>
                <p>
                  From elegant wedding ceremonies to large-scale corporate events,
                  from intimate jazz evenings to festival stages — we bring
                  musical excellence to every occasion.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Heart className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Our Mission</h4>
                    <p className="text-xs text-warm-white/40 mt-0.5">
                      Creating unforgettable musical experiences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Our Vision</h4>
                    <p className="text-xs text-warm-white/40 mt-0.5">
                      To be the world&apos;s premier entertainment brand
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button variant="primary" asChild>
                  <Link href="/about">
                    Read Our Story <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/band">Meet the Band</Link>
                </Button>
              </div>
            </div>
          </SlideFromRight>
        </div>
      </Container>
    </section>
  );
}
