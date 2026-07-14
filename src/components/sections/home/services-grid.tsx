"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";
import {
  Heart,
  Building2,
  PartyPopper,
  Cake,
  Hotel,
  UtensilsCrossed,
  Mic2,
  Tent,
  Church,
  GraduationCap,
  Headphones,
  Guitar,
  Music,
  Music2,
  Globe,
  Package,
} from "lucide-react";

const services = [
  { icon: Heart, title: "Wedding Entertainment", description: "Create magical moments on your special day", href: "/services#wedding" },
  { icon: Building2, title: "Corporate Events", description: "Elevate your corporate functions", href: "/services#corporate" },
  { icon: PartyPopper, title: "Private Parties", description: "Unforgettable private celebrations", href: "/services#parties" },
  { icon: Cake, title: "Birthday Celebrations", description: "Make birthdays extraordinary", href: "/services#birthdays" },
  { icon: Hotel, title: "Hotel Performances", description: "Elevate guest experiences", href: "/services#hotels" },
  { icon: UtensilsCrossed, title: "Restaurant Entertainment", description: "Ambient live music dining", href: "/services#restaurants" },
  { icon: Mic2, title: "Concert Production", description: "Full-scale concert experiences", href: "/services#concerts" },
  { icon: Tent, title: "Festival Performances", description: "Captivate festival audiences", href: "/services#festivals" },
  { icon: Church, title: "Church Music", description: "Spiritual musical excellence", href: "/services#church" },
  { icon: GraduationCap, title: "Graduations", description: "Celebrate academic achievements", href: "/services#graduations" },
  { icon: Headphones, title: "DJ + Live Band", description: "Best of both worlds", href: "/services#dj-live" },
  { icon: Guitar, title: "Acoustic Sessions", description: "Intimate unplugged performances", href: "/services#acoustic" },
  { icon: Music, title: "Jazz Band", description: "Sophisticated jazz ensemble", href: "/services#jazz" },
  { icon: Music2, title: "Traditional Music", description: "Cultural musical heritage", href: "/services#traditional" },
  { icon: Globe, title: "International Music", description: "Global musical repertoire", href: "/services#international" },
  { icon: Package, title: "Custom Packages", description: "Tailored to your vision", href: "/book" },
];

export function ServicesGrid() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <FadeUp>
          <SectionHeading
            badge="What We Offer"
            title="World-Class"
            highlighted="Entertainment"
            description="From intimate gatherings to grand productions, we deliver extraordinary musical experiences for every occasion."
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
