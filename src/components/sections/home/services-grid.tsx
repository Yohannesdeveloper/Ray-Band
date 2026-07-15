"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";
import {
  Mic2,
  Guitar,
  SlidersHorizontal,
  Music,
  Radio,
  Film,
  Headphones,
  BookOpen,
  Mic,
  Video,
} from "lucide-react";

const services = [
  { icon: Mic2, title: "Vocal Recording", description: "Professional vocal recording sessions", href: "/services" },
  { icon: Guitar, title: "Instrument Recording", description: "Multi-track instrument & band recording", href: "/services" },
  { icon: SlidersHorizontal, title: "Mixing & Mastering", description: "Professional audio mixing & mastering", href: "/services" },
  { icon: Music, title: "Music Production", description: "Beat making & full song production", href: "/services" },
  { icon: Radio, title: "Jingles", description: "Radio, TV & business audio branding", href: "/services" },
  { icon: Film, title: "Film & Documentary", description: "Cinematic scoring & soundtracks", href: "/services" },
  { icon: Headphones, title: "Podcast Studio", description: "Podcast recording & editing", href: "/services" },
  { icon: BookOpen, title: "Audiobook Recording", description: "Professional narration & mastering", href: "/services" },
  { icon: Mic, title: "Voice-over Production", description: "Commercials, TV, radio & more", href: "/services" },
  { icon: Video, title: "Content Creation", description: "YouTube & TikTok studio space", href: "/services" },
];

export function ServicesGrid() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <FadeUp>
          <SectionHeading
            badge="Our Studio"
            title="Premium"
            highlighted="Recording Studio"
            description="World-class recording, production, and content creation services with state-of-the-art equipment."
          />
        </FadeUp>

        <StaggerChildren className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <StaggerItem key={service.title}>
              <Link href={service.href}>
                <Card variant="hover" padding="md" className="h-full group">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-4 group-hover:bg-gold/20 group-hover:scale-110 transition-all">
                    <service.icon className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="font-semibold text-warm-white mb-1 group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-warm-white/40">
                    {service.description}
                  </p>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </Container>
    </section>
  );
}
