"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const musicians = [
  { name: "David Mehari", role: "Lead Vocals & Guitar", instrument: "Guitar", image: "/Bands/Guitarist.jpg" },
  { name: "Sarah Tesfaye", role: "Vocals & Keys", instrument: "Piano", image: "/Bands/Piano.jpg" },
  { name: "Mikael Desta", role: "Saxophone", instrument: "Saxophone", image: "/Bands/saxphonist.jpg" },
  { name: "Hana Bekele", role: "Violin", instrument: "Violin", image: "/Bands/masinko.jpg" },
  { name: "Yonatan Alem", role: "Drums", instrument: "Drums", image: "/Bands/photo_4_2026-07-15_09-36-54.jpg" },
  { name: "Ruth Girma", role: "Bass Guitar", instrument: "Bass", image: "/Bands/photo_5_2026-07-15_09-36-54.jpg" },
];

export function MeetBand() {
  return (
    <section className="py-24 bg-surface">
      <Container>
        <div className="flex items-end justify-between mb-16">
          <FadeUp>
            <SectionHeading
              badge="Our Musicians"
              title="Meet the"
              highlighted="Band"
              description="World-class musicians united by passion and excellence."
              align="left"
            />
          </FadeUp>
          <Link
            href="/band"
            className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StaggerChildren>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {musicians.map((musician) => (
              <StaggerItem key={musician.name}>
                <Link href={`/band/${musician.name.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Card variant="hover" padding="none" className="group overflow-hidden">
                    <div className="aspect-[3/4] bg-charcoal relative overflow-hidden">
                      {musician.image ? (
                        <img src={musician.image} alt={musician.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-gold/50">
                              {musician.name.split(" ").map(n => n[0]).join("")}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ExternalLink className="w-6 h-6 text-gold" />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-warm-white group-hover:text-gold transition-colors">
                        {musician.name}
                      </h3>
                      <p className="text-xs text-warm-white/40 mt-0.5">{musician.role}</p>
                      <Badge variant="glass" size="sm" className="mt-2">
                        {musician.instrument}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerChildren>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/band">
              View All Musicians <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
