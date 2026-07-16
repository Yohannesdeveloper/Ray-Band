import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Target,
  Sparkles,
  Award,
  Music,
  Users,
  CalendarCheck,
  Globe,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Ray Entertainment and Promotion — a world-class live band entertainment company and music academy based in Addis Ababa, Ethiopia.",
};

const values = [
  { icon: Heart, title: "Passion", description: "Every note we play is fueled by genuine love for music." },
  { icon: Target, title: "Excellence", description: "We set the bar high and continuously push beyond it." },
  { icon: Sparkles, title: "Creativity", description: "Innovation and originality define our performances." },
  { icon: Globe, title: "Cultural Heritage", description: "We honor tradition while embracing the global music landscape." },
];

const timeline = [
  { year: "2014", title: "The Beginning", description: "Founded by a group of passionate musicians in Addis Ababa." },
  { year: "2016", title: "First Major Corporate Event", description: "Performed at our first large-scale corporate gala." },
  { year: "2018", title: "Academy Launch", description: "Opened the Ray Entertainment and Promotion Music Academy to nurture the next generation." },
  { year: "2020", title: "Going Digital", description: "Launched online courses reaching students worldwide." },
  { year: "2022", title: "International Expansion", description: "Performed at international events across Africa and beyond." },
  { year: "2024", title: "1000+ Clients", description: "Reached the milestone of 1000+ happy clients." },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">About Ray Entertainment and Promotion</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                The Story Behind the{" "}
                <span className="gradient-text">Music</span>
              </h1>
              <p className="text-lg text-warm-white/60 leading-relaxed">
                From a passionate group of musicians to one of the
                country&apos;s most prestigious entertainment brands — this is
                our journey of creating unforgettable musical experiences.
              </p>
            </div>
          </Container>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 bg-surface">
          <Container>
            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="glass" padding="lg">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                  <Target className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-3">
                  Our Mission
                </h3>
                <p className="text-warm-white/60 leading-relaxed">
                  To create extraordinary musical experiences that transform events into
                  unforgettable memories, while nurturing the next generation of musicians
                  through world-class education.
                </p>
              </Card>
              <Card variant="glass" padding="lg">
                <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-5">
                  <Sparkles className="w-6 h-6 text-gold" />
                </div>
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] mb-3">
                  Our Vision
                </h3>
                <p className="text-warm-white/60 leading-relaxed">
                  To be the world&apos;s premier entertainment brand, recognized for
                  musical excellence, innovative performances, and commitment to making
                  quality music education accessible to all.
                </p>
              </Card>
            </div>
          </Container>
        </section>

        {/* Values */}
        <section className="py-24 bg-background">
          <Container>
            <SectionHeading
              badge="What Drives Us"
              title="Our Core"
              highlighted="Values"
            />
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value) => (
                <Card key={value.title} variant="hover" padding="lg" className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-warm-white/40">{value.description}</p>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-surface">
          <Container>
            <SectionHeading
              badge="Our Journey"
              title="A Decade of"
              highlighted="Excellence"
            />
            <div className="mt-16 max-w-3xl mx-auto">
              {timeline.map((item, i) => (
                <div key={item.year} className="flex gap-6 mb-12 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-gold">{item.year}</span>
                    </div>
                    {i < timeline.length - 1 && (
                      <div className="w-px flex-1 bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-sm text-warm-white/50">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Stats */}
        <section className="py-24 bg-background">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { icon: Music, value: "500+", label: "Performances" },
                { icon: Users, value: "1000+", label: "Happy Clients" },
                { icon: CalendarCheck, value: "10+", label: "Years Experience" },
                { icon: Award, value: "15+", label: "Awards Won" },
              ].map((stat) => (
                <div key={stat.label}>
                  <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                  <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-warm-white/40 mt-1">{stat.label}</div>
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
