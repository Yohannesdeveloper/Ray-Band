"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mic2, Guitar, SlidersHorizontal, Music, Radio, Film,
  Headphones, BookOpen, Mic, Video, ArrowRight, Check,
  Clock, Users, Upload, FileAudio,
} from "lucide-react";

const studioServices = [
  {
    icon: Mic2,
    title: "Vocal Recording",
    description: "Professional vocal recording in an acoustically treated studio.",
    features: [
      "Solo artists, choirs, duets, and group recordings",
      "Multiple takes with comping",
      "High-quality microphones and audio equipment",
      "Session booking with selectable duration (1, 2, 4, or 8 hours)",
    ],
    pricing: "From 7,000 ETB/hr",
  },
  {
    icon: Guitar,
    title: "Instrument Recording",
    description: "Record guitar, piano, bass, drums, traditional Ethiopian instruments, and full bands.",
    features: [
      "Multi-track recording for live bands",
      "Option to book individual musicians or full-band sessions",
      "Studio engineer included during recording",
      "Full range of instruments supported",
    ],
    pricing: "From 8,500 ETB/hr",
  },
  {
    icon: SlidersHorizontal,
    title: "Mixing & Mastering",
    description: "Professional audio mixing with EQ, compression, effects, and vocal tuning.",
    features: [
      "Stereo mastering for Spotify, Apple Music, YouTube, and radio",
      "Upload songs for online mixing/mastering",
      "Revision request system",
      "Delivery in WAV, MP3, and other required formats",
    ],
    pricing: "From 15,000 ETB/track",
  },
  {
    icon: Music,
    title: "Music Production",
    description: "Beat making, full song production, arrangement and composition.",
    features: [
      "Beat making and full song production",
      "Arrangement and composition",
      "Instrument programming and sound design",
      "Custom production based on genre selection",
      "Upload demo recordings and project ideas",
    ],
    pricing: "Custom quote",
  },
  {
    icon: Radio,
    title: "Jingles for Radio, TV & Businesses",
    description: "Commercial jingles, company audio branding, and promotional audio.",
    features: [
      "Commercial jingles and company audio branding",
      "Radio station intros",
      "TV advertisement music",
      "Business promotional audio",
      "Custom pricing based on project scope",
    ],
    pricing: "Custom quote",
  },
  {
    icon: Film,
    title: "Film & Documentary Music",
    description: "Original background music, cinematic scoring, and documentary soundtracks.",
    features: [
      "Original background music and cinematic scoring",
      "Documentary soundtrack production",
      "Scene-based music composition",
      "Music synchronized with video",
    ],
    pricing: "Custom quote",
  },
  {
    icon: Headphones,
    title: "Podcast Recording & Editing",
    description: "Full podcast production from recording to publish-ready audio.",
    features: [
      "Podcast studio booking",
      "Multi-speaker recording",
      "Noise reduction and audio cleanup",
      "Intro/outro music",
      "Publish-ready audio exports",
    ],
    pricing: "From 5,500 ETB/hr",
  },
  {
    icon: BookOpen,
    title: "Audiobook Recording",
    description: "Professional narration recording with chapter organization and mastering.",
    features: [
      "Professional narration recording",
      "Chapter organization and audio editing",
      "Noise removal",
      "Mastering for Audible and other audiobook platforms",
    ],
    pricing: "From 4,500 ETB/hr",
  },
  {
    icon: Mic,
    title: "Voice-over Production",
    description: "Voice-over recording for commercials, TV, radio, YouTube, corporate, and more.",
    features: [
      "Commercials, TV, radio, YouTube",
      "Corporate presentations and IVR telephone systems",
      "Explainer videos",
      "Script upload feature",
      "Multiple language support",
    ],
    pricing: "From 7,000 ETB/spot",
  },
  {
    icon: Video,
    title: "YouTube & TikTok Content Creation",
    description: "Studio space for content creators with multi-camera recording and editing.",
    features: [
      "Studio space for creators",
      "Multi-camera recording and lighting setup",
      "Green screen option",
      "Short-form video editing",
      "Thumbnail design and social media optimization",
    ],
    pricing: "From 12,000 ETB/session",
  },
];

export default function StudioPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Music Studio</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Premium{" "}
                <span className="gradient-text">Recording Studio</span>
              </h1>
              <p className="text-lg text-warm-white/60 leading-relaxed mb-8">
                World-class recording, production, and content creation services.
                From vocal sessions to full-scale productions — we bring your
                vision to life with state-of-the-art equipment and expert engineers.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="gold" asChild>
                  <Link href="/services/request">
                    Book a Session <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/services/request">
                    Request a Quote
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Studio
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Studio Highlights */}
        <section className="py-12 bg-surface border-y border-border">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { icon: Clock, label: "Flexible Hours", value: "1–8 hr sessions" },
                { icon: Users, label: "Expert Engineers", value: "Included in every session" },
                { icon: Upload, label: "Upload Projects", value: "Submit demos online" },
                { icon: FileAudio, label: "All Formats", value: "WAV, MP3, MP4 & more" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-4.5 h-4.5 text-gold" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-warm-white">{item.label}</p>
                    <p className="text-xs text-warm-white/40">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Services Grid */}
        <section className="py-24 bg-background">
          <Container>
            <div className="grid md:grid-cols-2 gap-6">
              {studioServices.map((service) => (
                <Card key={service.title} variant="bordered" padding="lg" className="group hover:border-gold/30 transition-colors">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                      <service.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)]">
                          {service.title}
                        </h3>
                        <span className="text-xs text-gold font-medium bg-gold/10 px-2 py-0.5 rounded-full shrink-0">
                          {service.pricing}
                        </span>
                      </div>
                      <p className="text-sm text-warm-white/50 mb-4">
                        {service.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        {service.features.map((f) => (
                          <div key={f} className="flex items-start gap-2 text-xs text-warm-white/40">
                            <Check className="w-3 h-3 text-gold shrink-0 mt-0.5" />
                            {f}
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/services/request?services=${encodeURIComponent(service.title)}`}>
                          Book Session <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="py-24 bg-surface border-t border-border">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-4">
                Ready to <span className="gradient-text">Create</span>?
              </h2>
              <p className="text-warm-white/50 mb-8">
                Book your studio session today or contact us for a custom project quote.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="gold" asChild>
                  <Link href="/services/request">
                    Book a Session <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Studio
                  </Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
