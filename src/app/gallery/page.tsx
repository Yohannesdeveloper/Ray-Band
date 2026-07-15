"use client";

import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

const videos: { src: string; category: string }[] = [];

const tabs = ["All", "Concerts", "Events", "Behind the Scenes"];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const filtered = activeTab === "All" ? videos : videos.filter((v) => v.category === activeTab);

  const handleHover = (index: number, playing: boolean) => {
    const video = videoRefs.current.get(index);
    if (video) {
      if (playing) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  const openLightbox = (index: number) => {
    setSelectedVideo(index);
  };

  const closeLightbox = () => {
    setSelectedVideo(null);
  };

  const navigate = (dir: number) => {
    if (selectedVideo === null) return;
    const next = selectedVideo + dir;
    if (next >= 0 && next < filtered.length) {
      setSelectedVideo(next);
    }
  };

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
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gold/10 border border-gold/20 text-gold"
                      : "border border-border text-warm-white/60 hover:text-warm-white hover:border-gold/30"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((video, i) => (
                <div
                  key={video.src}
                  className={`rounded-xl bg-surface border border-border overflow-hidden group cursor-pointer relative ${
                    i % 7 === 0 ? "md:col-span-2 md:row-span-2" : ""
                  } aspect-square`}
                  onMouseEnter={() => handleHover(i, true)}
                  onMouseLeave={() => handleHover(i, false)}
                  onClick={() => openLightbox(i)}
                >
                  <video
                    ref={(el) => { if (el) videoRefs.current.set(i, el); }}
                    src={video.src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-5 h-5 text-gold ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] uppercase tracking-wider text-warm-white/50 bg-charcoal/60 backdrop-blur-sm px-2 py-0.5 rounded">
                      {video.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>

      {selectedVideo !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
          <button onClick={(e) => { e.stopPropagation(); closeLightbox(); }} className="absolute top-6 right-6 text-warm-white/60 hover:text-warm-white transition-colors z-10">
            <X className="w-6 h-6" />
          </button>
          {selectedVideo > 0 && (
            <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="absolute left-4 md:left-8 text-warm-white/60 hover:text-warm-white transition-colors z-10">
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}
          {selectedVideo < filtered.length - 1 && (
            <button onClick={(e) => { e.stopPropagation(); navigate(1); }} className="absolute right-4 md:right-8 text-warm-white/60 hover:text-warm-white transition-colors z-10">
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
          <video
            key={filtered[selectedVideo].src}
            src={filtered[selectedVideo].src}
            className="max-w-[90vw] max-h-[85vh] rounded-lg"
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-6 text-center">
            <span className="text-xs text-warm-white/40">{selectedVideo + 1} / {filtered.length}</span>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
