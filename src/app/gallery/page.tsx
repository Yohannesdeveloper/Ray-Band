import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Explore photos and videos from Ray Band performances, events, concerts, and behind-the-scenes moments.",
};

const tabs = ["All", "Images", "Videos", "Behind the Scenes", "Concerts", "Weddings", "Corporate"];
const items = Array.from({ length: 12 }, (_, i) => i);

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Gallery</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Moments <span className="gradient-text">Captured</span>
              </h1>
              <p className="text-lg text-warm-white/60">
                A visual journey through our performances, events, and behind-the-scenes magic.
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-24 bg-background">
          <Container>
            <div className="flex flex-wrap gap-2 mb-10">
              {tabs.map((tab, i) => (
                <button
                  key={tab}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    i === 0
                      ? "bg-gold/10 border border-gold/20 text-gold"
                      : "border border-border text-warm-white/60 hover:text-warm-white hover:border-gold/30"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {items.map((i) => (
                <div
                  key={i}
                  className={`rounded-xl bg-surface border border-border overflow-hidden group cursor-pointer relative ${
                    i % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""
                  } aspect-square`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-surface-lighter" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gold/5 flex items-center justify-center">
                    <span className="text-sm text-gold font-medium">View</span>
                  </div>
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
