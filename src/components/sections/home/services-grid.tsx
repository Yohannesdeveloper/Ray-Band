"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";
import {
  Music,
  Radio,
  Mic2,
  Volume2,
  Sun,
  Camera,
  Video,
  Users,
} from "lucide-react";

const services = [
  { icon: Music, title: "Live Band", description: "Professional live band for any event", href: "/book" },
  { icon: Radio, title: "DJ Service", description: "Expert DJ to keep the party going", href: "/book" },
  { icon: Mic2, title: "MC/Host", description: "Professional MC to host your event", href: "/book" },
  { icon: Volume2, title: "Sound System", description: "High-quality sound system rental", href: "/book" },
  { icon: Sun, title: "Lighting", description: "Stage & event lighting design", href: "/book" },
  { icon: Camera, title: "Photography", description: "Professional event photography", href: "/book" },
  { icon: Video, title: "Videography", description: "Event videography & highlights", href: "/book" },
  { icon: Users, title: "Event Planning", description: "Full event planning & coordination", href: "/book" },
];

export function ServicesGrid() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <FadeUp>
          <SectionHeading
            badge="Our Services"
            title="Premium"
            highlighted="Entertainment"
            description="World-class live band, DJ, sound, lighting, and event services for any occasion."
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
