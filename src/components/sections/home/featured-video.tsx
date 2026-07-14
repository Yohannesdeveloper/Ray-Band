"use client";

import { Play, Volume2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";

export function FeaturedVideo() {
  return (
    <section id="featured-video" className="py-24 bg-surface">
      <Container>
        <SectionHeading
          badge="Featured Performance"
          title="Experience the"
          highlighted="Magic"
          description="Watch our latest live performance and feel the energy we bring to every stage."
        />

        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal border border-border group cursor-pointer">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-surface to-charcoal" />
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-deep-red/10 rounded-full blur-[100px]" />
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center group-hover:bg-gold/30 group-hover:scale-110 transition-all duration-300">
                <Play className="w-8 h-8 text-gold ml-1" />
              </div>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="gold" className="mb-2">Live Session</Badge>
                  <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
                    Ray Band Live — Unplugged Session Vol. 3
                  </h3>
                  <p className="text-sm text-warm-white/50 mt-1">
                    Filmed at the National Theatre • 45 min
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-warm-white/50" />
                  <div className="w-20 h-1 rounded-full bg-white/20">
                    <div className="w-1/3 h-full rounded-full bg-gold" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
