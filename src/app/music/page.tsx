import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Music Library",
  description:
    "Listen to Natis albums, singles, and live sessions. Stream and download our music.",
};

const featuredArtists = [
  {
    name: "Paul McCartney",
    title: "Official Media",
    description:
      "Photography, videos, books, 20 albums, 13 live albums, HD remastered music videos, podcasts, films, and art.",
    url: "https://www.paulmccartney.com/media",
    image: "/Music/paul-mccartney.jpg",
    tags: ["Albums", "Live", "Videos", "Books", "Podcasts", "Films"],
  },
  {
    name: "Duff McKagan",
    title: "Lighthouse: Live From London",
    description:
      "An all-new live album and full-length concert recorded October 5, 2024, at London's historic Islington Assembly Hall. Available on Double LP, CD, and CD/Blu-ray.",
    url: "https://duffmckagan.com/",
    image: "/Music/duff-mckagan.jpg",
    tags: ["Live Album", "Rock", "Radio Show"],
  },
  {
    name: "George Harrison",
    title: "Give Me Love (Give Me Peace on Earth)",
    description:
      "Official video from the Living in the Material World album. A timeless spiritual anthem of peace and love.",
    url: "https://www.georgeharrison.com/videos/george-harrison-give-me-love/",
    image: "/Music/george-harrison.jpg",
    tags: ["Classic Rock", "Spiritual", "Official Video"],
  },
];

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
                Stream and explore our curated collection of legendary artists and performances.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-surface">
          <Container>
            <h2 className="text-2xl font-bold font-[family-name:var(--font-playfair)] mb-8">Featured Artists</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArtists.map((artist) => (
                <a key={artist.name} href={artist.url} target="_blank" rel="noopener noreferrer">
                  <Card variant="bordered" padding="none" className="group hover:border-gold/30 transition-colors overflow-hidden h-full">
                    <div className="aspect-video bg-charcoal relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-charcoal to-gold/10" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gold/15 flex items-center justify-center group-hover:bg-gold/25 transition-colors">
                          <Play className="w-6 h-6 text-gold ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <ExternalLink className="w-4 h-4 text-warm-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] group-hover:text-gold transition-colors">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-gold mt-1">{artist.title}</p>
                      <p className="text-sm text-warm-white/50 mt-3 leading-relaxed">{artist.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {artist.tags.map((tag) => (
                          <span key={tag} className="text-[10px] uppercase tracking-wider text-warm-white/40 bg-surface-lighter px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                </a>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
