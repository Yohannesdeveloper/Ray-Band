import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";
import { AudioPlayer } from "@/components/player/audio-player";

export const metadata: Metadata = {
  title: "Music Library",
  description:
    "Listen to Natis albums, singles, and live sessions. Stream and download our music.",
};

export default function MusicPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Music Library</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Our <span className="gradient-text">Music</span>
              </h1>
              <p className="text-lg text-warm-white/60">
                Stream and explore our discography. From studio albums to live sessions.
              </p>
            </div>
          </Container>
        </section>

        {/* Empty state — albums and tracks will be added here */}
        <section className="py-16 bg-surface">
          <Container>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-8">Albums & EPs</h2>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Music className="w-12 h-12 text-warm-white/10 mb-4" />
              <p className="text-warm-white/30">Music coming soon. Stay tuned.</p>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-background">
          <Container>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-8">Tracks</h2>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Music className="w-12 h-12 text-warm-white/10 mb-4" />
              <p className="text-warm-white/30">Tracks coming soon. Stay tuned.</p>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <AudioPlayer />
    </>
  );
}
