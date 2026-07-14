import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart, Building2, PartyPopper, Cake, Hotel,
  UtensilsCrossed, Mic2, Tent, Church,
  GraduationCap, Headphones, Guitar, Music,
  Music2, Globe, Package, ArrowRight, Check,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Premium entertainment services for weddings, corporate events, private parties, hotels, and more.",
};

const services = [
  { icon: Heart, title: "Wedding Entertainment", description: "Make your special day truly magical with our bespoke wedding music packages. From ceremony to reception, we create the perfect soundtrack for your love story.", features: ["Ceremony music", "Cocktail hour", "Reception band", "First dance", "DJ service"], href: "/book" },
  { icon: Building2, title: "Corporate Events", description: "Elevate your corporate functions with world-class entertainment. Perfect for galas, product launches, team building, and conferences.", features: ["Gala dinners", "Product launches", "Team events", "Annual parties", "Conference entertainment"], href: "/book" },
  { icon: PartyPopper, title: "Private Parties", description: "Transform your private celebrations into extraordinary experiences with tailored musical performances.", features: ["Anniversaries", "Milestone celebrations", "Graduation parties", "Holiday parties", "Theme events"], href: "/book" },
  { icon: Cake, title: "Birthday Celebrations", description: "Make every birthday unforgettable with live music that gets everyone celebrating.", features: ["Kids parties", "Sweet sixteen", "30th/40th/50th+", "Surprise parties", "Custom themes"], href: "/book" },
  { icon: Hotel, title: "Hotel Performances", description: "Enhance your guests' experience with regular live entertainment that sets your hotel apart.", features: ["Lobby performances", "Poolside sessions", "Event entertainment", "Regular residencies", "Special events"], href: "/book" },
  { icon: UtensilsCrossed, title: "Restaurant Entertainment", description: "Create the perfect dining ambiance with sophisticated live background music.", features: ["Ambient music", "Jazz evenings", "Acoustic sessions", "Sunday brunch", "Special occasions"], href: "/book" },
  { icon: Mic2, title: "Concert Production", description: "Full-scale concert experiences from intimate venues to stadium shows.", features: ["Sound production", "Lighting design", "Stage management", "Artist coordination", "Full production"], href: "/book" },
  { icon: Tent, title: "Festival Performances", description: "Captivate festival audiences with high-energy performances that leave lasting impressions.", features: ["Main stage", "Side stages", "Workshops", "Jam sessions", "Multi-day bookings"], href: "/book" },
  { icon: Church, title: "Church Music", description: "Spiritual musical excellence for worship services, revivals, and church celebrations.", features: ["Worship bands", "Choir accompaniment", "Special services", "Conferences", "Youth events"], href: "/book" },
  { icon: GraduationCap, title: "Graduations", description: "Celebrate academic achievements with music that honors this important milestone.", features: ["Ceremony music", "Reception entertainment", "Award ceremonies", "Alumni events", "Class reunions"], href: "/book" },
  { icon: Headphones, title: "DJ + Live Band", description: "The perfect fusion of live performance energy and DJ versatility.", features: ["Hybrid sets", "Seamless transitions", "Full dance floor", "Custom mix", "All genres"], href: "/book" },
  { icon: Guitar, title: "Acoustic Sessions", description: "Intimate unplugged performances perfect for smaller venues and special moments.", features: ["Duo/Trio sets", "Background music", "Intimate venues", "Romantic settings", "Acoustic covers"], href: "/book" },
  { icon: Music, title: "Jazz Band", description: "Sophisticated jazz ensemble for upscale events and intimate evenings.", features: ["Smooth jazz", "Bebop", "Fusion", "Latin jazz", "Jazz standards"], href: "/book" },
  { icon: Music2, title: "Traditional Music", description: "Celebrate cultural heritage with authentic traditional music performances.", features: ["Ethiopian traditional", "East African", "Cultural events", "Heritage celebrations", "Folk music"], href: "/book" },
  { icon: Globe, title: "International Music", description: "Global musical repertoire spanning multiple genres and cultures.", features: ["Afrobeats", "Latin music", "R&B/Soul", "Pop covers", "World music"], href: "/book" },
  { icon: Package, title: "Custom Packages", description: "Tailored entertainment solutions designed specifically for your vision and budget.", features: ["Custom lineups", "Flexible duration", "Special requests", "Multiple artists", "Full production"], href: "/book" },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Our Services</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Entertainment for{" "}
                <span className="gradient-text">Every Occasion</span>
              </h1>
              <p className="text-lg text-warm-white/60 leading-relaxed">
                From intimate gatherings to grand productions, we deliver
                extraordinary musical experiences tailored to your vision.
              </p>
            </div>
          </Container>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-surface">
          <Container>
            <div className="grid md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Card key={service.title} variant="bordered" padding="lg" className="group hover:border-gold/30 transition-colors">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                      <service.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-warm-white/50 mb-4">
                        {service.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {service.features.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-xs text-warm-white/40">
                            <Check className="w-3 h-3 text-gold shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={service.href}>
                          Book Now <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
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
